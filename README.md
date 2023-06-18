# Interview Scheduler

A single page application that allows students to schedule interviews.

## Features

- Interviews can be booked between Monday and Friday.
- Interviews are booked by typing in a student name and clicking on an interviewer from a list of available interviewers.
- A user can cancel an existing interview.
- A user can edit the details of an existing interview.
- The expected day updates the number of spots available when an interview is booked or canceled.
- A user is presented with a confirmation when they attempt to cancel an interview.
- A user is shown an error if an interview cannot be saved or deleted.
- A user is shown a status indicator while asynchronous operations are in progress.

## Stack

- React
- Axios
- PostgreSQL
- Node.js
- Express

### Testing Stack

- Storybook
- Cypress
- Jest

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Scheduler Preview

![Screenshot of scheduler application.](https://raw.githubusercontent.com/eliachow/scheduler/master/docs/scheduler_preview_1.jpg)

![Screenshot of scheduler form.](https://raw.githubusercontent.com/eliachow/scheduler/master/docs/scheduler_preview_2.jpg)

### Asynchronous Messages

![Screenshot of asynchronous Deleting message.](https://raw.githubusercontent.com/eliachow/scheduler/master/docs/scheduler_preview_9.jpg)

![Screenshot of asynchronous Saving message.](https://raw.githubusercontent.com/eliachow/scheduler/master/docs/scheduler_preview_11.jpg)

### Error Messages

![Screenshot Deleting error message.](https://raw.githubusercontent.com/eliachow/scheduler/master/docs/scheduler_preview_8.jpg)

![Screenshot Saving error message.](https://raw.githubusercontent.com/eliachow/scheduler/master/docs/scheduler_preview_10.jpg)
