import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import chalk from 'chalk';


// Import your routes
import anime from './routes/anime';


const fastify = Fastify({
  maxParamLength: 1000,
  logger: true,
});

(async () => {
  const PORT = Number(process.env.PORT) || 3000;

  await fastify.register(FastifyCors, {
    origin: '*',
    methods: 'GET',
  });

  console.log(chalk.green(`Starting server on port ${PORT}... 🚀`));


  await fastify.register(anime, { prefix: '/anime' });
  
  
  try {
    fastify.get('/', (_, rp) => {
      rp.status(200).send(
        `Welcome to anime api! by bread 🎉`,
      );
    });
    fastify.get('*', (request, reply) => {
      reply.status(404).send({
        message: '',
        error: 'page not found',
      });
    });

    fastify.listen({ port: PORT, host: '0.0.0.0' }, (e, address) => {
      if (e) throw e;
      console.log(`server listening on ${address}`);
    });
  } catch (err: any) {
    fastify.log.error(err);
    process.exit(1);
  }
})();

export default async function handler(req: any, res: any) {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}