Skill Arena – Web Technology (01CE1306) CSE Project
Harsh Raychura (92500103016) – Marwadi University

Open index.html in a browser (internet needed once for Bootstrap CSS and Google Fonts; the site still works with its own CSS).

Pages
Client (6): index.html (Login / Sign Up), courses.html, categories.html, category-courses.html, course-details.html, my-learning.html Admin (8, inside /admin): login, dashboard, courses, categories, users, enrollments, reports, settings

Demo logins – student: student@skillarena.com / Student@123 (or sign up; sign up goes straight to My Learning). Admin: admin / Admin@123.

JavaScript validation (rubric: 2 forms) – code in js/validation.js
Form 1 – Student Sign Up (index.html): Fig 1.1 required fields (submit empty), 1.2 password under 8 characters, 1.3 invalid email, 1.4 password without upper/lower/digit/special (try skill1234), 1.5 phone not exactly 10 digits. Valid example: Skill@123. Form 2 – Admin Add User (admin/users.html > Add User): name required, valid email, password length and pattern, confirm password must match, 10-digit phone.

Responsive
Navbar collapses to a menu button under 820px; admin sidebar becomes a slide-in menu under 992px; card grids reflow. Test at 375, 768, 1366 and 1920px.

Developed by Harsh Raychura
B.Tech Computer Engineering
Marwadi University
