import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <section className="w-full max-w-md text-center">
        <p className="text-sm text-zinc-400 mb-3">AI 첫인상 판정</p>

        <h1 className="text-5xl font-black tracking-tight mb-4">넌딱</h1>

        <p className="text-zinc-300 leading-7 mb-8">
          사진 한 장으로 보는 내 분위기.
          <br />
          친구들이 인정할까?
        </p>

        <Link
          href="/create"
          className="block w-full rounded-2xl bg-white text-zinc-950 py-4 font-bold text-lg"
        >
          내 결과 만들기
        </Link>
      </section>
    </main>
  );
}
