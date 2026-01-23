import markdown

def test_markdown_tables():
    md_text = """
## 3. Implementation Timeline (4-Week Sprint)


| Milestone | Status | Target Date |
| --- | --- | --- |
| Project Setup & SQL Schema | In Progress | Jan 30th |
| Billing Logic and CPT Engine | Todo | Feb 6th |
| React Dashboard Polish, Data Visualization | Todo | Feb 14th |
| 100% Test Coverage + Deployment | Todo | Feb 20th |
"""
    html = markdown.markdown(md_text, extensions=['fenced_code', 'codehilite', 'tables'])
    print(html)
    assert "<table>" in html
    assert "<th>Milestone</th>" in html
    assert "<td>Project Setup &amp; SQL Schema</td>" in html
    print("Test passed: Markdown tables rendered correctly.")

if __name__ == "__main__":
    test_markdown_tables()
