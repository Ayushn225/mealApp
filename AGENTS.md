# Project Rules & Context (agents.md)

## 1. Core Agent Rules (CRITICAL)

1. **Always Read Prompts & Wait for Approval:** Always thoroughly read the user's prompts. Before making any code changes or introducing structural features, provide a clear, step-by-step implementation plan. You must wait for the user to explicitly say "yes that is i want" (or give explicit approval) before proceeding to execute the plan.
2. **Do NOT Auto-Complete the Project:** This is a practice/learning project. Do not generate massive blocks of code or build out entire screens or backend logic ahead of time. Act as a mentor—guide the user, review their logic, and implement changes strictly one piece at a time.
3. **Log Successful Changes:** After each successful change is completed and verified, you must append a summary of what was done to a `changelog.md` file in the root of the project.

---

## 2. Project Overview & Goals

This is a full-stack mobile **MealApp** focused on exploring real-time user state and remote data integration. The goal is to build out the application using a clean 4-page UI layout split across two entry states:
*   **Authentication State:** A custom Sign-In onboarding entry page.
*   **Authenticated Tab Shell:** A navigation bar containing a **Home Page**, a **Discover Page** (pulling dynamic live data from TheMealDB API), a **Saved Page** (storing user selections permanently), and a user **Profile Page**.

---

## 3. Tech Stack

The project relies strictly on the following technologies:
*   **Framework:** Expo SDK 54 (React Native)
*   **Routing & Navigation:** Expo Router (File-based tab routing)
*   **Styling Engine:** NativeWind v4 (Tailwind CSS for React Native)
*   **Authentication & Session Management:** Clerk (`@clerk/clerk-expo`)
*   **Database & Serverless Infrastructure:** Convex Real-Time DB

---

## 4. File Structure

Keep all code organized cleanly within the following structure:

```text
├── .agents/
│   └── agents.md          # Current system rules & roles
├── app/                   # Expo Router entry point
│   ├── (tabs)/            # Authenticated application navigation shell
│   │   ├── _layout.tsx    # Tab bar style configuration
│   │   ├── discover.tsx   # Meal search screen (targets TheMealDB API)
│   │   ├── home.tsx       # Main feed hub screen
│   │   ├── profile.tsx    # User account details screen
│   │   └── saved.tsx      # User-specific meal collection layout
│   ├── _layout.tsx        # App entry wrapper (Injects Clerk/Convex/NativeWind)
│   └── index.tsx          # Authentication gate / Sign-in route switcher
├── components/            # Reusable UI component blocks
├── convex/                # Real-time backend serverless architecture
│   ├── _generated/        # Automatically managed Convex build types
│   ├── auth.config.ts     # Clerk JWT validation handshake map
│   ├── meals.ts           # Saved meal query & mutation data operations
│   └── schema.ts          # Database table configuration schemas
├── changelog.md           # Continuous change history tracking
├── global.css             # Tailwind directive entry point
├── metro.config.js        # NativeWind bundler transformation rules
└── package.json           # Active dependency registry