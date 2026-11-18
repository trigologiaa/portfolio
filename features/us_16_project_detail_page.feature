@US-15
Feature: Project Detail page
  As a technical recruiter
  I want more detail about a project
  So that I can evaluate it

  Scenario: Detail page for an enriched project
    Given a project with an MDX file and 2 screenshots
    When I open "/en/projects/my-app"
    Then I see the title, the MDX body, 2 images and repo and demo links

  Scenario: Detail page for a bare GitHub project
    Given a project with only GitHub data
    When I open its detail page
    Then I see the description, tech tags, dates and the repo link
    And no empty sections are displayed

  Scenario: Excluded repository returns 404
    Given "old-experiment" is in the exclude list
    When I open "/en/projects/old-experiment"
    Then the response status is 404
    And the localized not-found page is shown

  Scenario: Previous and next navigation
    Given the curated list has projects a, b and c
    When I open the detail page of b
    Then links to a and c are present

  Scenario: Repository deleted on GitHub
    Given the page was generated earlier and the repo no longer exists in the API data
    When the data is revalidated
    Then the route returns 404
