import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4"
      dir="rtl"
    >
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <span className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#3b82f6]">
            404
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          عذرًا! الصفحة غير موجودة
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها. لا تقلق، دعنا نعيدك إلى
          الصفحة الرئيسية.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#3b82f6] text-[#f8fafc] font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          العودة للصفحة الرئيسية
        </Link>

        <div className="mt-12 flex justify-center space-x-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-blue-200 animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
