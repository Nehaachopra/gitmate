export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial message
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            message: "Connected",
            time: new Date().toISOString(),
          })}\n\n`
        )
      );

      // Send updates every second
      const interval = setInterval(() => {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              time: new Date().toISOString(),
            })}\n\n`
          )
        );
      }, 1000);

      // Cleanup
      return () => {
        clearInterval(interval);
      };
    },

    cancel() {
      console.log("Client disconnected");
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}