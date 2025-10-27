import json
import requests
from bs4 import BeautifulSoup

google_base_url = "https://www.google.com/about/careers/applications/jobs/results?"
google_location_param = "location="
google_experience_param = "target_level="  # [INTERN_AND_APPRENTICE, EARLY, MID, ADVANCED, DIRECTOR_PLUS]
google_skills_param = "skills="
google_degree_param = "degree="           # [PURSUING_DEGREE, ASSOCIATE, BACHELORS, MASTERS, DOCTORATE]
google_jobtype_param = "employment_type=" # [FULL_TIME, PART_TIME, TEMPORARY, INTERN]

def build_google_jobs_url(location="", experience="", skills="", degree="", job_type="FULL_TIME"):
    params = []
    if location:
        params.append(f"{google_location_param}{location}")
    if experience:
        params.append(f"{google_experience_param}{experience}")
    if skills:
        params.append(f"{google_skills_param}{skills}")
    if degree:
        params.append(f"{google_degree_param}{degree}")
    if job_type:
        params.append(f"{google_jobtype_param}{job_type}")

    return google_base_url + "&".join(params)

def scrape_google_jobs(location="", experience="", skills="", degree="", job_type="FULL_TIME"):
    search_url = build_google_jobs_url(location, experience, skills, degree, job_type)
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(search_url, headers=headers)

    if response.status_code != 200:
        return {"total_jobs": 0, "jobs": [], "search_url": search_url}

    soup = BeautifulSoup(response.text, "lxml")
    total_jobs = 0
    total_div = soup.find("div", class_="rZt9ff lvEMZd")
    if total_div:
        span = total_div.find("span")
        if span:
            try:
                total_jobs = int(span.text.strip().replace(",", ""))
            except ValueError:
                total_jobs = 0

    job_results = []
    for job_card in soup.find_all("a", class_="gc-card"):
        title_tag = job_card.find("h2")
        location_tag = job_card.find("div", class_="gc-card-location")
        if title_tag:
            job_results.append({
                "title": title_tag.text.strip(),
                "location": location_tag.text.strip() if location_tag else "N/A",
                "url": "https://www.google.com" + job_card["href"]
            })
    return {"total_jobs": total_jobs, "jobs": job_results, "search_url": search_url}

# Entry point for Node backend
if __name__ == "__main__":
    import sys
    input_data = json.loads(sys.stdin.read())
    result = scrape_google_jobs(
        location=input_data.get("location", ""),
        experience=input_data.get("experience", ""),
        skills=input_data.get("skills", ""),
        degree=input_data.get("degree", ""),
        job_type=input_data.get("job_type", "FULL_TIME")
    )
    print(json.dumps(result))
