import { ROLES } from "../../../constants/roles";

const users = [
  {
    id: 1,
    name: "Muhammad Admin",
    email: "admin@gmail.com",
    password: "123456",
    role: ROLES.SUPER_ADMIN,
  },
  {
    id: 2,
    name: "Ali Khan",
    email: "org@gmail.com",
    password: "123456",
    role: ROLES.ORG_ADMIN,
  },
  {
    id: 3,
    name: "Ahmed Hassan",
    email: "pm@gmail.com",
    password: "123456",
    role: ROLES.PROJECT_MANAGER,
  },
  {
    id: 4,
    name: "Hamza Ahmed",
    email: "scrum@gmail.com",
    password: "123456",
    role: ROLES.SCRUM_MASTER,
  },
  {
    id: 5,
    name: "Bilal Khan",
    email: "developer@gmail.com",
    password: "123456",
    role: ROLES.DEVELOPER,
  },
  {
    id: 6,
    name: "Ayesha Noor",
    email: "qa@gmail.com",
    password: "123456",
    role: ROLES.QA_TESTER,
  },
  {
    id: 7,
    name: "Sara Ali",
    email: "viewer@gmail.com",
    password: "123456",
    role: ROLES.VIEWER,
  },
];

export const loginUser = async ({
  email,
  password,
  remember,
}) => {
  await new Promise((resolve) =>
    setTimeout(resolve, 1000)
  );

  const user = users.find(
    (u) =>
      u.email === email &&
      u.password === password
  );

  if (!user) {
    throw new Error("Invalid Email or Password");
  }

  const authData = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: "dummy-jwt-token",
  };

  if (remember) {
    localStorage.setItem(
      "auth",
      JSON.stringify(authData)
    );

    sessionStorage.removeItem("auth");
  } else {
    sessionStorage.setItem(
      "auth",
      JSON.stringify(authData)
    );

    localStorage.removeItem("auth");
  }

  return authData;
};
