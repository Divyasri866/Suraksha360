"""
Suraksha360 - Automated Test Suite
Validates directory structure, HTML page integrity, relative link resolution,
asset availability, and JSON dataset schema.
"""

import os
import re
import json
import unittest

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FRONTEND_DIR = os.path.join(REPO_ROOT, "frontend")


class TestSuraksha360Structure(unittest.TestCase):
    """Verify repository structure and essential files exist."""

    def test_root_files_exist(self):
        root_files = [
            "index.html",
            "README.md",
            ".gitignore",
            ".env.example",
            "package.json",
        ]
        for f in root_files:
            path = os.path.join(REPO_ROOT, f)
            self.assertTrue(os.path.isfile(path), f"Missing root file: {f}")

    def test_frontend_pages_exist(self):
        pages = [
            "index.html",
            "profile.html",
            "registered-info.html",
            "alerts.html",
            "contacts.html",
            "address.html",
            "police-stations.html",
            "gps-tracking.html",
            "signin.html",
            "signup.html",
            "disguise-game.html",
            "logout.html",
        ]
        for page in pages:
            path = os.path.join(FRONTEND_DIR, page)
            self.assertTrue(os.path.isfile(path), f"Missing frontend page: {page}")

    def test_stylesheets_exist(self):
        css_files = ["main.css", "dashboard.css", "auth.css", "game.css"]
        for css in css_files:
            path = os.path.join(FRONTEND_DIR, "css", css)
            self.assertTrue(os.path.isfile(path), f"Missing stylesheet: {css}")

    def test_scripts_exist(self):
        js_files = ["app.js", "gps.js", "game.js"]
        for js in js_files:
            path = os.path.join(FRONTEND_DIR, "js", js)
            self.assertTrue(os.path.isfile(path), f"Missing JavaScript file: {js}")

    def test_documentation_exists(self):
        docs = ["ARCHITECTURE.md", "WORKFLOW.md", "API_DOCUMENTATION.md"]
        for doc in docs:
            path = os.path.join(REPO_ROOT, "docs", doc)
            self.assertTrue(os.path.isfile(path), f"Missing doc file: {doc}")


class TestDatasets(unittest.TestCase):
    """Validate project datasets."""

    def test_police_stations_json(self):
        json_path = os.path.join(REPO_ROOT, "data", "police_stations.json")
        self.assertTrue(os.path.isfile(json_path), "Missing data/police_stations.json")
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 10, "Expected at least 10 police stations")

        for station in data:
            self.assertIn("name", station)
            self.assertIn("phone", station)
            self.assertIn("address", station)
            self.assertIn("mapsUrl", station)
            self.assertTrue(len(station["name"]) > 0)
            self.assertTrue(len(station["phone"]) > 0)


class TestHyperlinksAndAssetIntegrity(unittest.TestCase):
    """Verify that all internal HTML links, scripts, and stylesheets resolve."""

    def test_internal_references(self):
        html_files = [f for f in os.listdir(FRONTEND_DIR) if f.endswith(".html")]

        link_pattern = re.compile(r'href=["\']([^"\']+)["\']')
        src_pattern = re.compile(r'src=["\']([^"\']+)["\']')

        for html_file in html_files:
            file_path = os.path.join(FRONTEND_DIR, html_file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Check stylesheets and internal links
            for match in link_pattern.findall(content):
                # Ignore external URLs, anchor hashes, tel, mailto, javascript
                if match.startswith(("http://", "https://", "#", "tel:", "mailto:", "javascript:")):
                    continue
                # Split off hash or query params
                clean_path = match.split("#")[0].split("?")[0]
                if not clean_path:
                    continue
                target_path = os.path.normpath(os.path.join(FRONTEND_DIR, clean_path))
                self.assertTrue(
                    os.path.exists(target_path),
                    f"Broken link in {html_file}: {match} -> {target_path} not found"
                )

            # Check script and image sources
            for match in src_pattern.findall(content):
                if match.startswith(("http://", "https://", "data:")):
                    continue
                clean_path = match.split("?")[0]
                target_path = os.path.normpath(os.path.join(FRONTEND_DIR, clean_path))
                self.assertTrue(
                    os.path.exists(target_path),
                    f"Broken src in {html_file}: {match} -> {target_path} not found"
                )


if __name__ == "__main__":
    unittest.main()
