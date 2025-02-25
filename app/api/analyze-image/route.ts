// export const dynamic = "force-static";

export async function POST(request: Request) {
  const image = request.body.image;

  console.log('image is - ',image)
  // const res = await fetch("https://data.mongodb-api.com/...", {
  //   headers: {
  //     "Content-Type": "application/json",
  //     "API-Key": process.env.DATA_API_KEY,
  //   },
  // });
  // const data = await res.json();

  return Response.json({ message: "done" });
}
