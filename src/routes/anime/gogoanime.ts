// File: routes/anime/gogoanime.ts

import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';


const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const gogoanime = new ANIME.Gogoanime();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the gogoanime ",
      routes: [
        '/:query',
        '/info/:id',
        '/watch/:episodeId',
        '/servers/:episodeId',
        '/genre/:genre',
        '/genre/list',
        '/top-airing',
        '/movies',
        '/popular',
        '/recent-episodes',
        '/anime-list',
      ],
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;
    const page = (request.query as { page: number }).page || 1;

    try {
      const res = await gogoanime.search(query, page);
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/info/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = decodeURIComponent((request.params as { id: string }).id);

    try {
      const res = await gogoanime.fetchAnimeInfo(id);
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/genre/:genre', async (request: FastifyRequest, reply: FastifyReply) => {
    const genre = (request.params as { genre: string }).genre;
    const page = (request.query as { page: number }).page ?? 1;

    try {
      const res = await gogoanime.fetchGenreInfo(genre, page);
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/genre/list', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const res = await gogoanime.fetchGenreList();
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/watch/:episodeId', async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = (request.params as { episodeId: string }).episodeId;
    const server = (request.query as { server: StreamingServers }).server;

    if (server && !Object.values(StreamingServers).includes(server)) {
      reply.status(400).send('Invalid server');
      return;
    }

    try {
      const res = await gogoanime.fetchEpisodeSources(episodeId, server);
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/servers/:episodeId', async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = (request.params as { episodeId: string }).episodeId;

    try {
      const res = await gogoanime.fetchEpisodeServers(episodeId);
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/top-airing', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page ?? 1;

    try {
      const res = await gogoanime.fetchTopAiring(page);
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({ message: 'Something went wrong. Contact developers for help.' });
    }
  });

  fastify.get('/movies', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page ?? 1;

    try {
      const res = await gogoanime.fetchRecentMovies(page);
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({ message: 'Something went wrong. Contact developers for help.' });
    }
  });

  fastify.get('/popular', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page ?? 1;

    try {
      const res = await gogoanime.fetchPopular(page);
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({ message: 'Something went wrong. Contact developers for help.' });
    }
  });


  fastify.get('/recent-episodes', async (request: FastifyRequest, reply: FastifyReply) => {
    const type = (request.query as { type: number }).type ?? 1;
    const page = (request.query as { page: number }).page ?? 1;

    try {
      const res = await gogoanime.fetchRecentEpisodes(page, type);
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({ message: 'Something went wrong. Contact developers for help.' });
    }
  });

  fastify.get('/anime-list', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page ?? 1;

    try {
      const res = await gogoanime.fetchAnimeList(page);
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({ message: 'Something went wrong. Contact developers for help.' });
    }
  });
};
  
export default routes;
