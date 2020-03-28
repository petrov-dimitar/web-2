import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { DepartmentsService } from 'src/app/services/departments.service';
import { Task } from 'src/app/interfaces/task';
import { Employee } from 'src/app/interfaces/employee';
import { Department } from 'src/app/interfaces/department';
import { MatTable } from '@angular/material/table';
import { CalendarService } from 'src/app/services/calendar.service';
import { Item } from 'ngx-time-scheduler';
import * as moment from 'moment';
@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css']
})
export class AddTaskDialogComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public taskService: TaskService, private employeeService: EmployeeService, private departmentService: DepartmentsService, public dialog: MatDialog, private calendarService: CalendarService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }


  newId: string;
  newTask: string;
  newTaskDescription: string;
  newDeadlineDate: Date;
  tasks: Task[];
  selectedTask: Task;
  employees: Employee[];
  selectedDueDate: Date;
  selectedEmployee: Employee;
  departments: Department[];
  selectedDepartment: Department;
  @ViewChild(MatTable) table: MatTable<any>;
  selectedStartDate: Date;
  selectedPriority: number;

  ngOnInit() {
    this.getTasks();
    this.getEmployees();
    this.getDepartments();
  }
  getTasks(): void {
    this.taskService.getTasks().subscribe(tasks => this.tasks = tasks);
  }

  getEmployees(): void {
    this.employeeService.getEmployee().subscribe(emp => this.employees = emp);
  }
  getDepartments(): void {
    this.departmentService.getDepartments().subscribe(dep => this.departments = dep);
  }
  deleteTask(task: Task) {
    let index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);
  }

  addTask() {
    console.log(this.selectedEmployee);
    this.taskService.addTaskToServer(new Task(Number(this.selectedDepartment.id), this.newTask, this.newTaskDescription, this.selectedDueDate)).subscribe(res => { console.log(res) })
    this.calendarService.addItem({
      id: Number(this.newId),
      sectionID: Number(this.selectedPriority),
      name: this.newTask,
      start: moment().startOf('day'),
      end: this.selectedDueDate,
      classes: 'red'
    })
    this.dialog.closeAll();
  }

  selectTask(task) {
    this.selectedTask = task;
  }

}
