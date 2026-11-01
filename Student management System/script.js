const form = document.getElementById("studentForm");
const list = document.getElementById("studentList");
const search = document.getElementById("search");

let students = JSON.parse(
  localStorage.getItem("students") || "[]"
);

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function displayStudents(data = students) {
  list.innerHTML = "";

  document.getElementById("total").textContent = students.length;

  if (data.length === 0) {
    list.innerHTML = `
      <tr><td colspan="5">No students found.</td></tr>
    `;
    return;
  }

  data.forEach(student => {
    const row = document.createElement("tr");

    [student.name, student.email, student.course, student.year]
      .forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

    const actions = document.createElement("td");

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.className = "edit";
    edit.onclick = () => editStudent(student.id);

    const remove = document.createElement("button");
    remove.textContent = "Delete";
    remove.className = "delete";
    remove.onclick = () => deleteStudent(student.id);

    actions.append(edit, remove);
    row.appendChild(actions);
    list.appendChild(row);
  });
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const id = document.getElementById("editId").value;

  const student = {
    id: id || Date.now().toString(),
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    course: document.getElementById("course").value.trim(),
    year: document.getElementById("year").value
  };

  if (students.some(s =>
    s.email.toLowerCase() === student.email.toLowerCase() &&
    s.id !== id
  )) {
    alert("This email is already registered!");
    return;
  }

  if (id) {
    students = students.map(s => s.id === id ? student : s);
  } else {
    students.push(student);
  }

  saveStudents();
  form.reset();
  document.getElementById("editId").value = "";
  document.getElementById("formTitle").textContent = "Add New Student";
  document.getElementById("submitBtn").textContent = "Add Student";
  document.getElementById("cancelBtn").hidden = true;

  displayStudents();
});

function editStudent(id) {
  const student = students.find(s => s.id === id);

  document.getElementById("editId").value = student.id;
  document.getElementById("name").value = student.name;
  document.getElementById("email").value = student.email;
  document.getElementById("course").value = student.course;
  document.getElementById("year").value = student.year;

  document.getElementById("formTitle").textContent = "Edit Student";
  document.getElementById("submitBtn").textContent = "Update Student";
  document.getElementById("cancelBtn").hidden = false;
}

function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  students = students.filter(s => s.id !== id);
  saveStudents();
  displayStudents();
}

document.getElementById("cancelBtn").addEventListener("click", () => {
  form.reset();
  document.getElementById("editId").value = "";
  document.getElementById("formTitle").textContent = "Add New Student";
  document.getElementById("submitBtn").textContent = "Add Student";
  document.getElementById("cancelBtn").hidden = true;
});

search.addEventListener("input", () => {
  const query = search.value.toLowerCase();

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.email.toLowerCase().includes(query) ||
    s.course.toLowerCase().includes(query)
  );

  displayStudents(filtered);
});

displayStudents();