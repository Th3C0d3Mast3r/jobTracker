import json
import requests
from bs4 import BeautifulSoup

stripe_base_url = "https://stripe.com/jobs/search?"
teams_param = "teams="
query_param = "query="

def build_stripe_url(teams="", query=""):
    params = []
    if teams:
        params.append(f"{teams_param}{teams}")
    if query:
        params.append(f"{query_param}{query}")
    return stripe_base_url + "&".join(params) if params else stripe_base_url

def scrape_stripe_jobs(teams="", query=""):
    url = build_stripe_url(teams, query)
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return {"total_jobs": 0, "jobs": [], "search_url": url}

    soup = BeautifulSoup(response.text, "lxml")
    job_rows = soup.select("tbody.TableBody.JobsListings__tableBody tr.TableRow")
    total_jobs = len(job_rows)

    jobs_list = []
    for row in job_rows:
        title_tag = row.select_one("td.JobsListings__tableCell--title a.JobsListings__link")
        dept_tag = row.select_one("td.JobsListings__tableCell--departments li.JobsListings__departmentsListItem")
        loc_tag = row.select_one("td.JobsListings__tableCell--country span.JobsListings__locationDisplayName")

        jobs_list.append({
            "title": title_tag.text.strip() if title_tag else "N/A",
            "department": dept_tag.text.strip() if dept_tag else "N/A",
            "location": loc_tag.text.strip() if loc_tag else "N/A",
            "url": title_tag["href"] if title_tag else "N/A"
        })

    return {"total_jobs": total_jobs, "jobs": jobs_list, "search_url": url}

if __name__ == "__main__":
    import sys
    input_data = json.loads(sys.stdin.read())
    result = scrape_stripe_jobs(
        teams=input_data.get("teams", ""),
        query=input_data.get("query", "")
    )
    print(json.dumps(result))