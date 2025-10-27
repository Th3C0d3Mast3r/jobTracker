import json
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

netflix_base_url = "https://explore.jobs.netflix.net/careers"
teams_param = "Teams="
work_type_param = "Work%20Type="
region_param = "Region="

def build_netflix_url(teams="", work_type="", region=""):
    params = []
    if teams:
        params.append(f"{teams_param}{teams}")
    if work_type:
        params.append(f"{work_type_param}{work_type}")
    if region:
        params.append(f"{region_param}{region}")
    return netflix_base_url + "?" + "&".join(params) if params else netflix_base_url

def scrape_netflix_jobs_headless(teams="", work_type="", region=""):
    url = build_netflix_url(teams, work_type, region)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, timeout=60000)
        page.wait_for_selector("div.message-top-container", timeout=10000)

        html = page.content()
        soup = BeautifulSoup(html, "lxml")

        strong_tag = soup.select_one("div.message-top-container strong")
        if strong_tag:
            text = strong_tag.text.strip()
            total_jobs = int("".join(filter(str.isdigit, text)))
        else:
            total_jobs = 0

        browser.close()
    return {"total_jobs": total_jobs, "search_url": url}

if __name__ == "__main__":
    import sys
    input_data = json.loads(sys.stdin.read())
    result = scrape_netflix_jobs_headless(
        teams=input_data.get("teams", ""),
        work_type=input_data.get("work_type", ""),
        region=input_data.get("region", "")
    )
    print(json.dumps(result))