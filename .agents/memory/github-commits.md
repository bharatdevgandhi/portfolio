---
name: GitHub commits
description: What the user means when asking to commit portfolio changes.
---

A request to commit this project's changes means updating GitHub, not only saving files or local history.

**Why:** The user explicitly clarified that committing to GitHub was what they intended.

**How to apply:** Verify the repository and branch, preserve existing remote history, commit the requested changes to GitHub, and confirm the resulting commit link. A source commit is not permission to publish the website.

Resolve the branch reference to its commit, then use that commit's explicit `tree.sha` for GitHub tree mutations.

**Why:** A branch-name tree lookup through the connector returned the commit SHA in its top-level `sha`; treating it as a tree SHA produced a false concurrent-change warning even though no files had changed.

**How to apply:** Compare remote heads using the ref's commit SHA, and pass the resolved commit's tree SHA as `base_tree`. Never force-update a remote branch to work around a mismatch.
