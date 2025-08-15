import { useAuthStore } from "@/stores/useAuthStore";

function GoogleLoginButton() {
  const { loginWithGoogle, loadingWithGoogle } = useAuthStore();

  return (
    <button
      onClick={loginWithGoogle}
      disabled={loadingWithGoogle}
      className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 533.5 544.3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.3h147.4c-6.4 34.1-25.5 62.8-54.2 82v68.2h87.7c51.2-47.1 80.6-116.5 80.6-195.1z"
          fill="#4285f4"
        />
        <path
          d="M272 544.3c73.7 0 135.5-24.5 180.7-66.6l-87.7-68.2c-24.4 16.4-55.5 26-93 26-71.6 0-132.3-48.3-154-113.2H27.4v70.9c45.1 89 137.5 150.1 244.6 150.1z"
          fill="#34a853"
        />
        <path
          d="M118 322.3c-10.4-30.8-10.4-64 0-94.8V156.6H27.4c-38.8 77.6-38.8 169.6 0 247.2L118 322.3z"
          fill="#fbbc04"
        />
        <path
          d="M272 107.7c39.9 0 75.7 13.7 103.8 40.6l77.8-77.8C407.5 24.5 345.7 0 272 0 164.9 0 72.5 61.1 27.4 150.1l90.6 70.9C139.7 156 200.4 107.7 272 107.7z"
          fill="#ea4335"
        />
      </svg>
      <span>
        {loadingWithGoogle ? "جارٍ الدخول..." : "تسجيل الدخول عبر Google"}
      </span>
    </button>
  );
}

export default GoogleLoginButton;
