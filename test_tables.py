import markdown

def test_markdown_tables():
    md_text = """
| Name | Age |
|------|-----|
| Alice| 30  |
| Bob  | 25  |
"""
    html = markdown.markdown(md_text, extensions=['fenced_code', 'codehilite', 'tables'])
    print(html)
    assert "<table>" in html
    assert "<th>Name</th>" in html
    assert "<td>Alice</td>" in html
    print("Test passed: Markdown tables rendered correctly.")

if __name__ == "__main__":
    test_markdown_tables()
