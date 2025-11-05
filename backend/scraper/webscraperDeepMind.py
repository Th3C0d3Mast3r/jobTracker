import json
import requests
from bs4 import BeautifulSoup

deepmind_base_url = "https://job-boards.greenhouse.io/deepmind/"
deepmind_keyword_param = "?keyword="

def scrape_deepmind_jobs(keyword=""):
    url = deepmind_base_url + deepmind_keyword_param + keyword.replace(" ", "%20")
    result = {"total_jobs": 0, "jobs": [], "search_url": url}

    response = requests.get(url)
    if response.status_code != 200:
        return result

    soup = BeautifulSoup(response.text, "html.parser")
    padding_div = soup.find("div", class_="padding")
    if not padding_div:
        return result

    # Total jobs
    job_count_header = padding_div.find("h2", class_="section-header section-header--large font-primary", attrs={"data-testid": "job-count-header"})
    if job_count_header:
        total_text = job_count_header.get_text(strip=True)
        try:
            result["total_jobs"] = int(total_text.split()[0])
        except:
            result["total_jobs"] = 0

    # Job listings
    for job_card in soup.find_all("div", class_="opening"):
        title_tag = job_card.find("a")
        job_title = title_tag.get_text(strip=True) if title_tag else "N/A"
        job_link = "https://boards.greenhouse.io/deepmind" + title_tag["href"] if title_tag else ""
        location_tag = job_card.find("span", class_="location")
        location_name = location_tag.get_text(strip=True) if location_tag else "N/A"

        result["jobs"].append({
            "title": job_title,
            "location": location_name,
            "url": job_link
        })

    return result

if __name__ == "__main__":
    import sys
    input_data = json.loads(sys.stdin.read())
    result = scrape_deepmind_jobs(keyword=input_data.get("keyword", ""))
    print(json.dumps(result))
