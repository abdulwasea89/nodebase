---
trigger: always_on
---

===============================================
CHANGE LOG TEMPLATE
===============================================

# [Brief Title of Change]

Date: YYYY-MM-DD  
Time: HH:MM:SS +Timezone  
Session: [Session/Sprint Name]

------------------------------------------------
DESCRIPTION
------------------------------------------------
[Detailed description of what changed. Include the problem, the reason, and the solution. Be direct and precise.]

------------------------------------------------
FILES CHANGED
------------------------------------------------

Created Files:
- path/to/file.ext — Purpose

Modified Files:
- path/to/file.ext — Summary of modification

Deleted Files:
- path/to/file.ext — Reason for deletion

------------------------------------------------
REFERENCES
------------------------------------------------

Direct Dependencies:
- path/to/file.ext — How it relates to the change

Related Components:
- path/to/file.ext — Files indirectly affected

External Dependencies:
- package-name — Why this dependency matters

------------------------------------------------
REASON FOR CHANGES
------------------------------------------------

Problem:
[Describe the issue.]

Root Cause:
[The real, underlying cause.]

Solution:
[Exact fix implemented.]

Alternatives Considered:
[Why other solutions were rejected.]

------------------------------------------------
IMPACT
------------------------------------------------

What This Fixes:
- [Specific fix]
- [Improvement]

What This Affects:
- Component X: How it changed
- Feature Y: How it changed

Breaking Changes:
- [List breaking changes]
- [Migration steps if needed]

------------------------------------------------
TESTING PERFORMED
------------------------------------------------

1. Test case: Result
2. Test case: Result
3. Test case: Result

------------------------------------------------
TECHNICAL NOTES
------------------------------------------------
[Important technical notes for future developers.]

------------------------------------------------
NEXT STEPS
------------------------------------------------
[Next actions required.]

------------------------------------------------
DEVELOPER NOTES
------------------------------------------------
[Personal insights, warnings, or context.]



===============================================
CHANGE TRACKER RULES (NON-NEGOTIABLE)
===============================================

1. EVERY CHANGE MUST BE LOGGED  
   - No exceptions.  
   - If a file changes, you create a log entry.  
   - Delay = failure.

2. FILENAME MUST BE TIMESTAMP-BASED  
   Format:  
   YYYY-MM-DD_HH-mm-ss_description.md  
   - No custom names.  
   - Timestamp is the version ID.

3. TEMPLATE MUST BE FOLLOWED EXACTLY  
   - No section may be removed.  
   - If a section has no content, write "None".  
   - Consistency > creativity.

4. DOCUMENT THE WHY, NOT JUST THE WHAT  
   - If you cannot justify a change, do not make it.  
   - Logs must show reasoning, not just actions.

5. EVERY LOG MUST REFERENCE THE PREVIOUS ONE  
   - This maintains a full chain of system evolution.  
   - Missing references break the integrity of the system.

6. IMPACT ANALYSIS IS MANDATORY  
   - State what improved, what broke, and what changed.  
   - No sugarcoating.

7. NEXT STEPS ARE REQUIRED  
   - Every log must push the project forward.  
   - No change is “complete” without defined next actions.

8. NO EMOTIONAL DEVELOPMENT  
   - Decisions must be based on logic, not feelings.  
   - “Feels better” is not an acceptable justification.

9. LOGS MUST BE CLEAR AND FUTURE-PROOF  
   - Write for future developers, including future you.  
   - No vague notes, no shorthand that only you understand.

10. CHANGE TRACKER FOLDER IS SACRED  
    - No unrelated files.  
    - Only logs, templates, or scripts that support the system.  
    - Maintain order and discipline.