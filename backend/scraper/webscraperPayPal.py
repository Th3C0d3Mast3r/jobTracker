import json
import requests
from bs4 import BeautifulSoup

paypal_base_url = "https://paypal.eightfold.ai/careers?"
paypal_distance_param="&filter_distance="
paypal_skills_param="&filter_skills="
paypal_job_category="&filter_job_category="
paypal_worklocation_option="&filter_work_location_option="
