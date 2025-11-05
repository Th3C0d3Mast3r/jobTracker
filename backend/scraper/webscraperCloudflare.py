import json
from playwright.sync_api import sync_playwright

cloudflare_base_url = "https://www.cloudflare.com/careers/jobs/"
cloudflare_location_param = "&location="
cloudflare_department_param = "&department="
cloudflare_title_param = "&title="

def scrape_cloudflare_jobs(location="", department="", title=""):
    # Build URL with params
    url = (
        cloudflare_base_url
        + cloudflare_location_param + location.replace(" ", "%20")
        + cloudflare_department_param + department.replace(" ", "%20")
        + cloudflare_title_param + title.replace(" ", "%20")
    )

    jobs_result = {"total_jobs": 0, "jobs": [], "search_url": url}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)
        
        # Wait for jobs container to appear
        try:
            page.wait_for_selector("div.w-100.flex.flex-row.flex-wrap.bb.b--gray0.justify-center.pv1", timeout=5000)
        except:
            browser.close()
            return jobs_result  # no jobs found

        job_divs = page.query_selector_all("div.w-100.flex.flex-row.flex-wrap.bb.b--gray0.justify-center.pv1")
        jobs_result["total_jobs"] = len(job_divs)

        for job_div in job_divs:
            title_tag = job_div.query_selector("a")
            job_title = title_tag.inner_text().strip() if title_tag else "N/A"
            job_link = title_tag.get_attribute("href") if title_tag else ""
            department_tag = job_div.query_selector("h3")
            department = department_tag.inner_text().strip() if department_tag else "N/A"
            location_tag = job_div.query_selector("span.location")
            location_name = location_tag.inner_text().strip() if location_tag else "N/A"

            jobs_result["jobs"].append({
                "title": job_title,
                "department": department,
                "location": location_name,
                "url": f"https://www.cloudflare.com{job_link}"
            })

        browser.close()
    return jobs_result

if __name__ == "__main__":
    import sys
    input_data = json.loads(sys.stdin.read())
    result = scrape_cloudflare_jobs(
        location=input_data.get("location", ""),
        department=input_data.get("department", ""),
        title=input_data.get("title", "")
    )
    print(json.dumps(result))
