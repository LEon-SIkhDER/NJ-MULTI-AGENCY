

const Services = () => {
    return (
        <section className="min-h-[70vh] flex items-center justify-center bg-[#0f1115] px-6  mt-16">
            <div className="text-center max-w-2xl">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-white/40">
                    Services
                </p>

                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Coming Soon
                </h1>

                <p className="mt-5 text-base leading-7 text-white/50 sm:text-lg">
                    We’re currently preparing our services page.
                    <br />
                    Everything will be updated here very soon.
                </p>

                <div className="mx-auto mt-8 h-1 w-20 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-white/60" />
                </div>
            </div>
        </section>
        // <div>hello</div>
    );
};

export default Services;