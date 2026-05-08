# 🧠 Algorithm Visualizer

An interactive platform to visualize **Data Structures & Algorithms** step-by-step using animations and state-driven execution.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 🎯 What This Project Does

Most algorithm platforms explain solutions **statically**.

This project converts algorithms into **visual execution states** so users can watch how algorithms *think* internally — not just read about them.

Instead of staring at code, users can watch:

- 📍 Pointers move across arrays
- 🪟 Windows expand and shrink
- 🔍 Binary search ranges narrow
- 🗂️ HashSets update in real time
- ✅ Answers evolve step-by-step

> The goal is to build **algorithm intuition** for programmers, students, and interview prep.

---

## ✨ Current Visualizations

### 🪟 Sliding Window
- Fixed-size and variable-size window visualization
- Pointer movement (`i`, `j`)
- Window expansion & shrinking
- Running sum updates

### 🔡 Longest Substring Without Repeating Characters
- Dynamic sliding window
- Duplicate detection
- HashSet visualization
- Maximum length tracking

### 🔍 Binary Search
- Left / Right / Mid pointer visualization
- Search range shrinking animation
- Target detection highlight

---

## ⚙️ Core Idea

Algorithms are transformed into discrete execution states that drive the UI:
```ts
Algorithm → Execution States → UI Rendering → Animated Visualization
```

Each algorithm generates snapshots at every decision point:

```ts
states.push({
  left,
  right,
  mid,
  found,
});
```

The UI renders these states sequentially to create an **interactive, step-by-step learning experience**.

---

## 🏗️ Architecture

```text
src/
|
├── algorithms/        # Generates execution states
│
├── components/        # Reusable visual components
│
├── pages/             # Algorithm visualizer pages
│
├── config/            # Algorithm registry & configuration
│
└── App.tsx
```


---

## 🚀 Running Locally

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## ✅ Current Features

- ♻️ Reusable visualization engine
- 🧩 Generic array visualizer
- 🔀 Dynamic algorithm selector
- 🎞️ Animated transitions via Framer Motion
- 🧱 Modular architecture for adding new algorithms
- ⚙️ Config-driven rendering system

---

## 🗺️ Planned Features

- [ ] Play / Pause / Step controls
- [ ] Speed controls
- [ ] Complexity visualization (Time & Space)
- [ ] Code line highlighting (synchronized with steps)
- [ ] Tree visualizations
- [ ] Graph algorithms (BFS, DFS, Dijkstra)
- [ ] Dynamic Programming table animations
- [ ] Recursion stack visualization
- [ ] Sorting algorithm animations
- [ ] Custom user input
- [ ] Algorithm categories & search

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| shadcn/ui | UI components |
| Vite | Build tool |

---

## 💡 Why I Built This

Understanding *why* an algorithm works is harder than memorizing *how* it works.

This platform focuses on:

- 🔎 **Visual intuition** — see decisions as they happen
- 🧭 **Pointer mechanics** — watch indices move in real time
- 🔄 **State evolution** — observe how data changes each step
- 🧠 **Pattern recognition** — build mental models, not just memory

---

## 🌐 Future Vision

The long-term goal is a **complete interactive DSA learning platform** with:

- Visual execution for all major algorithm patterns
- Pattern-based learning paths
- Interview preparation mode
- Algorithm playgrounds with custom inputs
- Educational storytelling overlays

---

## 🤝 Contributing

Ideas, feedback, and contributions are welcome!

Feel free to open an issue or submit a pull request.

---

## 📄 License

MIT License — free to use, modify, and distribute.
