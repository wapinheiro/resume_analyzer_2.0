# Pac-Man Arcade Leaderboard - Wireframe Candidates & Design Spec

**Project**: BYU Resume Analyzer 2.0  
**Feature**: Student High Score Leaderboard  
**Design Theme**: Classic Pac-Man Arcade High Scores (1980 Retro)  
**Status**: In Progress  

---

## 🎨 Visual Identity & Retro Palette

Inspired by classic 1980 Pac-Man arcade cabinets:

- **Background**: Pure Black (`#000000`) with subtle CRT scanline overlay option.
- **Font**: Monospace Pixel / Arcade Font (`'Press Start 2P'`, `'Courier New'`, or `font-mono`).
- **Header Color**: Neon Cyan (`#00FFFF`)
- **Column Header Color**: Bright Yellow (`#FFFF00`)
- **Rank Color Palette**:
  - `1ST`: Pure White (`#FFFFFF`)
  - `2ND`: Arcade Red (`#FF0000`)
  - `3RD`: Neon Orange (`#FF9900`)
  - `4TH`: Light Pink (`#FFB8FF`)
  - `5TH`: Golden Yellow (`#FFCC00`)
  - `6TH`: Canary Yellow (`#FFFF33`)
  - `7TH`: Mint Green (`#00FF66`)
  - `8TH`: Arcade Cyan (`#00FFFF`)
  - `9TH`: Sky Blue (`#3399FF`)
  - `10TH`: Bright Green (`#00FF00`)

---

## 📐 Candidate 1: Authentic Arcade Cabinet (Pure Retro)

An authentic, pixel-perfect reproduction of the original Pac-Man High Score screen.

```text
+-----------------------------------------------------------------------+
|                                                                       |
|                              HIGH SCORES                              |
|                                                                       |
|    RANK          SCORE          NAME          MAJOR         YEAR      |
|                                                                       |
|    1ST           9900           WAP           COMP SCI      SR        |
|    2ND           9700           RMR           COMP SCI      JR        |
|    3RD           9600           JWC           CYBERSEC      SR        |
|    4TH           9500           SKT           DATA SCI      SO        |
|    5TH           9400           TBS           COMP SCI      SR        |
|    6TH           9300           MNM           COMP SCI      JR        |
|    7TH           9200           WKJ           CYBERSEC      SR        |
|    8TH           9100           SVO           DATA SCI      FR        |
|    9TH           9000           WHO           COMP SCI      SR        |
|   10TH           8900           TRN           COMP SCI      JR        |
|                                                                       |
|                       👾 [ PAC-MAN SPRITE ] 👾                       |
|                                                                       |
|  CREDIT  0               ACTIVE BYU CS STUDENTS ONLY                 |
+-----------------------------------------------------------------------+
```

### Characteristics
- **Score Conversion**: RMS scores (0–100) displayed as 4-digit Arcade Scores (e.g. RMS 99 → `9900 PTS`).
- **3-Letter Initials**: Uses classic 3-letter arcade initials (`WAP`, `RMR`, `JWC`) with full student name visible on hover.
- **Footer**: Retro `CREDIT 0` text at bottom left.

---

## 📐 Candidate 2: BYU Navy & Arcade Hybrid (Modern Meets Retro)

Blends BYU's primary Navy identity (`#002E5D`) with the Pac-Man arcade high score aesthetic. Perfect for student engagement without breaking web accessibility standards.

```text
+-----------------------------------------------------------------------+
| 🏆 BYU CS HIGH SCORE LEADERBOARD                    [ 🕹️ Arcade Mode ] |
| Track top market-ready resumes across current BYU CS students          |
|-----------------------------------------------------------------------|
|  [ ALL MAJORS ]  [ COMP SCI ]  [ CYBERSEC ]    |  Filter: [ THIS MONTH ]|
|-----------------------------------------------------------------------|
|                                                                       |
|   RANK     SCORE   INITIALS   STUDENT NAME         BADGE       YEAR   |
|  ------------------------------------------------------------------   |
|   1ST      99/100    WAP      Wagner P.        [ MARKET READY ]  SR   |
|   2ND      97/100    RMR      Ryan Richards    [ MARKET READY ]  JR   |
|   3RD      96/100    JWC      James W.         [ MARKET READY ]  SR   |
|   4TH      95/100    SKT      Sarah K.         [ INTERN READY ]  SO   |
|   5TH      94/100    TBS      Tyler B.         [ INTERN READY ]  SR   |
|   6TH      93/100    MNM      Michael M.       [ INTERN READY ]  JR   |
|   7TH      92/100    WKJ      Will K.          [ INTERN READY ]  SR   |
|   8TH      91/100    SVO      Steven V.        [ INTERN READY ]  FR   |
|   9TH      90/100    WHO      William H.       [ INTERN READY ]  SR   |
|  10TH      89/100    TRN      Taylor R.        [ TOURIST ]       JR   |
|                                                                       |
|-----------------------------------------------------------------------|
| 🔒 FERPA Privacy: Only active students who opted in are shown.        |
| Want your name here? [ UPLOAD YOUR RESUME TO BEAT THE HIGH SCORE ]    |
+-----------------------------------------------------------------------+
```

### Characteristics
- **Bilingual Score Display**: Shows both RMS / 100 and Arcade Points.
- **Privacy Controls**: Opt-in toggle in user settings (*"Show my initials on BYU CS Leaderboard"*).
- **Interactive Call To Action**: Prompts non-ranked students with `"INSERT COIN / UPLOAD RESUME TO BEAT THE HIGH SCORE"`.

---

## 📐 Candidate 3: Animated Podium + Arcade High Score Matrix

Features a Top 3 Arcade Trophy Podium at the top, followed by ranks 4–10 in a compact arcade matrix.

```text
+-----------------------------------------------------------------------+
|                            HALL OF FAME                               |
|                                                                       |
|                  +---------------+                                    |
|                  |  🥇 1ST PLACE |                                    |
|                  |     99 PTS    |                                    |
|                  |   WAP (SR)    |                                    |
|  +---------------+---------------+---------------+                    |
|  |  🥈 2ND PLACE |               |  🥉 3RD PLACE |                    |
|  |     97 PTS    |               |     96 PTS    |                    |
|  |   RMR (JR)    |               |   JWC (SR)    |                    |
|  +---------------+---------------+---------------+                    |
|                                                                       |
|  RANKS 4 - 10:                                                        |
|  4TH  |  95 PTS  |  SKT  |  Sarah K.      |  Data Science  |  Sophomore|
|  5TH  |  94 PTS  |  TBS  |  Tyler B.      |  Computer Sci  |  Senior   |
|  6TH  |  93 PTS  |  MNM  |  Michael M.    |  Computer Sci  |  Junior   |
|  7TH  |  92 PTS  |  WKJ  |  Will K.       |  Cybersecurity |  Senior   |
|  8TH  |  91 PTS  |  SVO  |  Steven V.     |  Data Science  |  Freshman |
|  9TH  |  90 PTS  |  WHO  |  William H.    |  Computer Sci  |  Senior   |
| 10TH  |  89 PTS  |  TRN  |  Taylor R.     |  Computer Sci  |  Junior   |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## 🛠️ Data Model & Requirements

1. **Active Students Only Filter**:
   - `User.role == "student"`
   - `User.is_active == True`
   - `User.leaderboard_opt_in == True`
2. **Arcade Initials**:
   - 3-character uppercase field `arcade_initials` (defaults to first 3 letters of name, e.g. `WAP`).
3. **Score Calculation**:
   - Highest `rms_score` achieved by student on their latest verified analysis.

