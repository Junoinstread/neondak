import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#11100d] px-6 text-white">
      <section className="w-full max-w-md text-center">
        <p className="mb-3 text-sm font-black text-red-300">
          사진 기반 밈 판정
        </p>

        <h1 className="mb-4 text-6xl font-black tracking-tight">넌딱</h1>

        <p className="mb-8 break-keep text-lg font-bold leading-8 text-zinc-200">
          사진 한 장 올리면
          <br />
          넌 딱 뭐 하는 상인지 쾅 찍어준다.
        </p>

        <Link
          href="/create"
          className="block w-full border-4 border-zinc-950 bg-red-600 py-4 text-lg font-black text-white shadow-[7px_7px_0_rgba(0,0,0,0.65)] transition active:translate-x-1 active:translate-y-1 active:shadow-[3px_3px_0_rgba(0,0,0,0.65)]"
        >
          판정 받기
        </Link>
      </section>
    </main>
  );
}
