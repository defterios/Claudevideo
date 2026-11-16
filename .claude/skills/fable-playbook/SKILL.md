---
name: fable-playbook
description: How to plan a task, break it into steps, and check your own work before reporting. Use at the start of any task with more than one step (a feature, a bug fix, a refactor, a render or build pipeline change, an investigation), and again before you say the work is done.
---

# Playbook: planning, decomposing, and checking work

This is a working method for multi-step tasks. Most of what goes wrong on such tasks comes from three sources: solving a slightly different problem than the one asked, building on an assumption nobody checked, and reporting something as done that was never observed working. The sections below are ordered to catch those three.

Scale the method to the task. A one-line fix needs a look at the surrounding code and a quick check that it works. A change across several files needs all of what follows.

## 1. Understand the request before touching anything

Restate the task to yourself in one or two sentences: what will exist when you are done, and how the user would tell that it worked. If you cannot write the second half, you do not understand the task yet.

Then read before you plan:

- Read the code the change will touch, plus one caller and one similar existing feature. The existing feature shows the conventions (naming, file layout, how things are wired together) that your change should follow.
- Look at recent commits. They show what the user has been working on, how they describe changes, and which parts of the project are in motion.
- Find how the project is run and checked: the scripts in the package manifest, the test command, the build or render command. You will need these in section 4, and it is better to learn now that one is broken than after your change.

Separate what you know from what you are guessing. A fact you read in a file or saw in command output is known. Anything else is a guess, including what a function does based on its name, what a library's API looks like from memory, and whether a file is still used. Guesses that the plan depends on get checked before the plan is built on them; a check usually costs one file read or one command.

Ask the user only when the answer changes what you build and you cannot find it in the request, the code, or a sensible default. When a default is reasonable, pick it, say which you picked, and continue.

## 2. Plan from the end state backwards

Start from the finished result and ask what has to be true for it to exist. Each answer is a candidate step. This keeps the plan tied to the outcome and stops it filling up with work that feels related but that nothing depends on.

A good plan for a medium-sized task is short, usually three to seven steps, and names for each step:

- what changes, in which files
- how you will know that step worked, as a concrete observation (a command exits zero, an output file has the expected duration, a screenshot shows the element)

Find the riskiest step and do it first. The riskiest step is the one where you know least: an unfamiliar library, an external tool, a file format you have not inspected. If it turns out not to work, you want to learn that before the other steps are built around it. A ten-line throwaway experiment in the scratchpad is often the fastest way to find out.

Prefer the smallest change that fully solves the problem. Do not add options, abstractions, or cleanup that the task did not ask for. If you notice something else worth fixing, mention it at the end instead of doing it.

For a task with several steps, keep a task list and update it as you go, so the state of the work survives a long session.

## 3. Work in steps that each leave things working

Make one step's change, check it, then move on. When a check fails right after a small change, the cause is in that change. When it fails after five unchecked changes, you have to search all five.

While working:

- Run independent lookups in parallel (several file reads, several searches). Run dependent actions in sequence.
- When a result surprises you, stop and find out why before continuing. A surprise means your picture of the system is wrong somewhere, and the rest of the plan was built on that picture.
- When something fails, read the whole error and find the cause. Do not retry the same command unchanged, and do not patch the symptom (catching the error, loosening a type, skipping a test) to get past it.
- If two attempts at the same approach have failed, step back and question the approach instead of making a third variation.
- If the plan turns out to be wrong, revise the plan explicitly. Do not keep following steps that no longer lead to the goal.
- Before deleting or overwriting anything, look at what is there. Work you did not create may be something the user still wants.

Stay inside the task. Actions that are hard to undo or that reach outside the workspace (force pushes, deleting branches, publishing, sending messages) need the user's go-ahead unless they already gave it for that specific action.

## 4. Check the work by observing it

A change is verified when you have watched it do the thing it is for. Code that looks right, compiles, or passes a type check has only passed a weaker test.

Use the strongest check available, in roughly this order:

1. Run the real thing and look at the result. For a UI, load it and take a screenshot. For a video or image pipeline, render a frame or a short segment and view it; probe the output file for duration, resolution, and audio streams. For a CLI or script, run it on real input and read the output.
2. Run the project's tests, type check, and linter.
3. Read your own diff from top to bottom as a reviewer would.

Do the third one every time, even when the first two pass. Reading the full diff catches leftover debug code, unrelated edits, files you meant to revert, and places where the change does something other than what you intended.

Then go back to the original request and check it line by line against what you did. Requests often have several parts, and the last or smallest part is the one that gets dropped.

Checks worth making on most changes:

- the edge of the input: empty, missing, very long, the first and last item
- the other callers of anything whose behavior or signature you changed
- that things which worked before still work, by running the existing checks rather than assuming
- that generated or rendered output was actually regenerated after your last edit, so you are not looking at a stale file

If a check cannot be run (a missing tool, no network, a render that takes too long), say so in the report and say what you did instead. Do not describe unverified work as working.

## 5. Report what happened

Lead with the outcome: what now exists and whether it works. Then give what the user needs in order to trust or act on it:

- what you verified and how, and what you could not verify
- anything that failed, was skipped, or behaves differently from what was asked, stated as plainly as the successes
- decisions you made on the user's behalf and the default you chose
- anything you need from them

Keep it short and write for someone who was not watching. Use full sentences, define any label you invented during the work, and leave out the history of how you got there unless it changes what the user should do.

Commit and push only when the user asked for it or the session's instructions require it, and write the commit message in the style the repository's history already uses.

## Quick reference

Before starting: can I say what done looks like and how I would observe it?

Before building on an assumption: did I read it or run it, or am I guessing?

After each step: did I see this step work?

Before reporting: did I run the real thing, read my whole diff, and reread the original request?

In the report: is every claim something I observed, and is everything I did not verify labeled as such?
