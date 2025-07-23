# Firefox Extension Update Required

## Fixed Race Condition Issue

**Problem**: "Receiving end does not exist" error when content script not ready after navigation.

**Fix Applied**: `background.js:157-184` - Added retry logic with content script injection.

## Update Steps

1. **Reload Extension in Firefox:**
   - Go to `about:debugging#/runtime/this-firefox`
   - Find "Browser MCP" extension
   - Click "Reload" button

2. **Test the Fix:**
   - Try: `Navigate to https://youtube.com`
   - Then: `Search for baxtrix` 
   - Should work without "Receiving end does not exist" error

## What Changed

- `handleContentScript()` now catches injection failures
- Automatically injects content script if missing
- Retries message after 100ms delay
- Provides proper error messages to Claude Code

The extension will now handle navigation → interaction sequences properly!