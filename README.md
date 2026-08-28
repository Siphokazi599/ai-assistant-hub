# AI Assistant Hub

AI Workplace Productivity Assistant

Build a modern, responsive frontend-only SaaS-style web application called AI Workplace Productivity Assistant.

The app helps professionals use AI to complete common workplace productivity tasks.

Important Technical Requirements

Frontend only

No backend

No database

No authentication

No login or registration

No user accounts

No payment system

Store temporary data only in browser state/localStorage if needed

Use mock/demo AI responses so the app works without an API key or backend

Keep the project simple enough to work within a free Lovable plan

Design

Create a clean, modern and professional SaaS dashboard.

Color theme:

Light purple as the primary accent

Dark navy/charcoal for text and sidebar

White/light backgrounds

Subtle purple gradients

Rounded cards

Soft shadows

Modern typography

Professional icons

Responsive on desktop, tablet and mobile

Dashboard Layout

Create:

Sidebar Navigation

Dashboard

Email Generator

Meeting Summarizer

Research Assistant

Task Planner

Settings

Include the app name/logo at the top and a simple responsive mobile navigation.

Dashboard Home

Show:

Welcome message

Quick action cards

Recent activity

Productivity statistics

Short description of each AI tool

AI Tools

1. Smart Email Generator

Allow users to enter:

Recipient/purpose

Subject or topic

Key points

Allow tone selection:

Formal

Friendly

Persuasive

Generate an editable professional email.

Include:

Generate button

Copy button

Clear button

Editable output area

2. Meeting Notes Summarizer

Provide a large text area where users can paste meeting notes.

Generate a structured summary containing:

Meeting Summary

Key Discussion Points

Decisions Made

Action Items

Responsible Person

Deadlines

Make the generated content editable and provide a Copy button.

3. AI Research Assistant

Allow users to enter a research topic or workplace question.

Generate a structured research response containing:

Overview

Key Findings

Important Points

Suggested Next Steps

Sources/References placeholder

Clearly indicate that the results are AI-generated and should be verified.

4. Task Planner

Allow users to enter tasks and optional deadlines.

Generate a suggested daily or weekly schedule.

Prioritise tasks as:

High

Medium

Low

Display tasks in a clean timeline or task-card layout.

Allow users to edit, complete and delete tasks.

AI Prompt System

Create structured frontend prompt templates for each AI tool.

The UI should make it clear what information the user provides and what the AI is expected to produce.

Because there is no backend or AI API, use realistic demo/mock AI responses that change based on the user's input where practical.

Do not require API keys.

Responsible AI

Include a visible Responsible AI Disclaimer:

"AI-generated content may contain mistakes, bias, or outdated information. Review and verify important information before using it in professional decisions or communications. Do not enter confidential, personal, or sensitive company information."

Also include a small disclaimer near AI-generated outputs.

User Experience

Smooth navigation between tools

Clear empty states

Loading animation when generating content

Toast notifications for actions such as copied, generated, saved and deleted

Editable AI outputs

Copy-to-clipboard functionality

Clear buttons

Responsive design

Accessible form controls

Helpful placeholder text

Professional error messages

Final Goal

The finished application should look like a polished AI productivity SaaS dashboard, but remain a simple frontend prototype that requires no login, backend, database, or paid API.

Prioritise a polished UI, usability, responsive design and realistic AI-demo functionality.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3b7ee4ea-410a-4349-b449-f2c3ed00f400).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
