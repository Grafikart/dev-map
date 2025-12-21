const data = {} as {
  chapters: {
    name: string;
    items: {
      name: string;
      duration: string;
    }[];
  }[];
};

export function Course() {
  return (
    <>
      <div className="absolute top-1/4 z-100 left-4 right-100 mr-4 text-slate-800  starting:-translate-x-20 starting:opacity-0 transition-all duration-600">
        <h1 className="text-4xl font-bold mb-4 pl-4">Apprendre l'HTML</h1>
        <div className="border border-gray-200 rounded-md p-4 bg-white">
          <iframe
            className="w-full aspect-video mb-4 rounded-md"
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/oEAuNzWXRjM?si=vpCMyy6VZN1M4fOS"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <p className="mb-4">
            L'HTML, pour HyperText Markup Language, constitue le langage de
            bases d'un site internet. Ce n'est pas un langage de programmation
            mais un langage de balisage qui permet d'écrire de l'hypertexte et
            ainsi de définir la structure sémantique d'une page web.
          </p>
          <p>
            L'hypertexte désigne un ou plusieurs documents qui contiennents des
            unités d'informations (textes, images, vidéos...) liées ensemble à
            travers des hyperliens.
          </p>
        </div>
      </div>
      <div className="max-h-[100vh] overflow-auto absolute left-auto inset-0 p-6 w-105 z-100 rounded-md isolate text-slate-800 starting:translate-x-20 starting:opacity-0 transition-all duration-600">
        <h2 className="text-3xl font-bold hidden">Chapitres</h2>
        <div className="space-y-4">
          {" "}
          {data.chapters.map((chapter) => (
            <div
              key={chapter.name}
              className="bg-white border border-gray-200 rounded-md pt-2"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-1 pl-4">
                {chapter.name}
              </h3>
              <div className="bg-white rounded-md">
                {chapter.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between border-b border-slate-100 p-2 px-4"
                  >
                    <div>{item.name}</div>
                    <div className="text-slate-500 text-sm text-nowrap">
                      {item.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>{" "}
      </div>
    </>
  );
}
