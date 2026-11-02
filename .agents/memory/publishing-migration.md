---
name: Publishing form migration
description: Existing Static publishing settings can block a server-hosted migration before any build starts.
---

Retain a valid public-directory value while the existing publishing form is still configured as Static. Changing an artifact to a Node process does not itself switch the publishing form to Autoscale.

**Why:** Removing the legacy public-directory value caused the user's publishing form to reject the update with “Public directory cannot be empty”; local builds and server tests had passed, and no failed deployment build was recorded.

**How to apply:** Keep the compatibility value until the publishing type is changed in the UI. Do not force the deployment target back to Static or delete the existing publication to resolve this validation error. Confirm the active deployment type separately from source configuration.
