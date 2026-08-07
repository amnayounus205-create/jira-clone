import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0052CC] text-white flex-col justify-center items-center p-16">

        <h1 className="text-5xl font-bold mb-6">
          Jira Clone
        </h1>

        <p className="text-xl opacity-90 text-center max-w-md">
          Manage projects, sprints, issues, reports and collaborate
          with your team using our professional Jira Clone.
        </p>

      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">

        <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">

          <div className="mb-8">

            <h2 className="text-3xl font-bold">
              Welcome Back 👋
            </h2>

            <p className="text-gray-500 mt-2">
              Login to continue
            </p>

          </div>

          <LoginForm />

        </div>

      </div>

    </div>
  );
};

export default LoginPage;