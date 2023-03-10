class Employee {
  constructor(name, address, phone, email, title) {
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.title = title;
  }
}

//API commands

class EmployeeRecords {

  static url = 'https://6408c6cc2f01352a8a9d2b49.mockapi.io/api/employees'

  static getAllEmployees() {
    return $.get(this.url);
  }

  static getEmployee(id) {
    return $.get(this.url + `/${id}`);
  }

  static createEmployee(employee) {
    return $.post(this.url, employee);
  }

  static updateEmployee(employee) {
    return $.ajax({
      url: this.url + `/${employee.id}`,
      dataType: 'json',
      data: JSON.stringify(employee),
      contentType: 'application/json',
      type: 'PUT'
    });
  }

  static deleteEmployee(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: 'DELETE'
    });
  }
}

//DOM commands

class DOMManager {
  static employees;

  static getAllEmployees() {
    EmployeeRecords.getAllEmployees().then(employees => this.render(employees));
  }

  static createEmployee(name, address, phone, email, title) {
    EmployeeRecords.createEmployee(new Employee(name, address, phone, email, title))
      .then(() => {
        return EmployeeRecords.getAllEmployees();
      })
      .then((employees) => this.render(employees));
  }

  static updateEmployee(id, field) {
    let newValue = prompt(`Enter the employee's new ${field}: `);
    // User pressed cancel
    if (newValue == null) {
      return;
    }
    // User did not enter a value
    if (newValue == '') {
      alert(`You did not enter a valid ${field}. Please try again.`);
      return;
    }
    // Get the employee by ID.
    EmployeeRecords.getEmployee(id)
      // Update the employee.
      .then((employee) => {
        // Update the employee title with newtitle.
        employee[field] = newValue;
        return EmployeeRecords.updateEmployee(employee);
      })
      // Get all employees once employee is updated.
      .then(() => {
        return EmployeeRecords.getAllEmployees();
      })
      // Rendering list of employees.
      .then((employees) => this.render(employees));
    
    }

  static deleteEmployee(id) {
    EmployeeRecords.deleteEmployee(id)
      .then(() => {
        return EmployeeRecords.getAllEmployees();
      })
      .then((employees) => this.render(employees));
  }

//rendering employee information into cards

  static render(employees) {
    this.employees = employees;
    $('#app');
    for (let employee of employees) {
      $('#app').prepend(
        `
          <div class="col-sm-12 col-md-6">
            <div id="${employee.id}" class="card mb-2">
              <div class="card-header">
                <button class="btn btn-danger float-end" onclick="DOMManager.deleteEmployee('${employee.id}')">Delete</button>
                <h4>${employee.name}</h4>
              </div>
              <div class="card-body">
                <p class="card-text">
                  <strong>Address: </strong>${employee.address}
                  <button class="btn btn-sm btn-secondary float-end" onclick="DOMManager.updateEmployee('${employee.id}','address')">Edit</button>
                </p>
                <p class="card-text">
                  <strong>Phone Number: </strong>${employee.phone}
                  <button class="btn btn-sm btn-secondary float-end" onclick="DOMManager.updateEmployee('${employee.id}','phone')">Edit</button>
                </p>
                <p class="card-text">
                  <strong>Email Address: </strong>${employee.email}
                  <button class="btn btn-sm btn-secondary float-end" onclick="DOMManager.updateEmployee('${employee.id}','email')">Edit</button>
                </p>
                <p class="card-text">
                  <strong>Job Title: </strong>${employee.title}
                  <button class="btn btn-sm btn-secondary float-end" onclick="DOMManager.updateEmployee('${employee.id}','title')">Edit</button>
                </p>
              </div>
            </div>
          </div>
        `

      )
    }
  }
}

//onclick event for creating a new employee

$('#create-new-employee').on('click', () => {
  DOMManager.createEmployee(
    $('#new-employee-name').val(),
    $('#new-employee-address').val(),
    $('#new-employee-phone').val(),
    $('#new-employee-email').val(),
    $('#new-employee-title').val()
  );

  $('#new-employee-name').val('');
  $('#new-employee-address').val('');
  $('#new-employee-phone').val('');
  $('#new-employee-email').val('');
  $('#new-employee-title').val('');
});

DOMManager.getAllEmployees();
