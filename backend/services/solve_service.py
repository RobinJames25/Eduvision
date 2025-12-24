import requests
from ..config import settings

def solve_equation(equation: str) -> str:
    url = "https://api.wolframalpha.com/v2/query"

    params = {
        "appid": settings.WOLFRAM_APP_ID,
        "input": equation,
        "output": "JSON"
    }

    try:
        res = requests.get(url, params=params, timeout=10)
    except requests.exceptions.RequestException as e:
        return f"Network error: {e}"

    # --- HTTP LEVEL ERRORS ---
    if res.status_code == 403:
        return "Error: Access forbidden (possible invalid App ID)."

    if res.status_code == 429:
        return "Error: Rate limit exceeded. Please try again later."

    if res.status_code != 200:
        return f"API error: {res.status_code} - {res.text}"

    # --- PARSE JSON ---
    data = res.json()

    # --- WOLFRAMALPHA INTERNAL ERRORS ---
    query = data.get("queryresult", {})

    if query.get("error", False):
        # Example: invalid AppID
        return f"WolframAlpha error: {query.get('error', {}).get('msg', 'Unknown error')}"

    if query.get("success") is False:
        # Happens when the problem cannot be interpreted
        return "WolframAlpha could not interpret the equation."

    if query.get("timedout", False):
        return "Error: WolframAlpha request timed out."

    # Check for rate limit inside the JSON
    if "warnings" in query:
        for w in query["warnings"]:
            if "rate limit" in str(w).lower():
                return "Error: Rate limit reached (from WolframAlpha warning)."

    # --- EXTRACT SOLUTION ---
    try:
        pods = query.get("pods", [])

        for pod in pods:
            title = pod.get("title", "").lower()
            if title in ["result", "solution", "solutions"]:
                return pod["subpods"][0]["plaintext"]

        return "No solution found."

    except Exception as e:
        return f"Error parsing response: {e}"
