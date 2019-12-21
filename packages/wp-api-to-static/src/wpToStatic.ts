import postsToStatic, {
  contentArgs,
  filePathArgs,
  wpToStaticReturn,
} from './postsToStatic';
import { getTotals } from './wp-api/getTotals';

/**
 * Convert all content of a WordPress to static
 *
 * @param apiUrl
 * @param filePathArgs
 */
export default async function wpToStatic(
  apiUrl: string,
  filePathArgs: filePathArgs
): Promise<Array<Array<wpToStaticReturn>>> {
  return new Promise(async (resolve, reject) => {
    const totals = await getTotals(apiUrl);
    const { totalPosts, totalPages, perPage } = totals;
    const promises: Array<Promise<Array<wpToStaticReturn>>> = [];
    const makeContentArgs = (args: {
      postType: string;
      perPage: number;
      page: number;
    }): contentArgs => {
      return {
        ...args,
        endpoint: apiUrl,
        perPage: 10,
      };
    };
    for (let postsPage: number = 1; postsPage <= totalPosts; postsPage++) {
      promises.push(
        postsToStatic(
          makeContentArgs({
            postType: 'post',
            perPage,
            page: postsPage,
          }),
          filePathArgs
        )
      );
    }
    for (let pagePage: number = 1; pagePage <= totalPages; pagePage++) {
      promises.push(
        postsToStatic(
          makeContentArgs({
            postType: 'page',
            perPage,
            page: pagePage,
          }),
          filePathArgs
        )
      );
    }
    Promise.all(promises)
      .then((results: Array<Array<wpToStaticReturn>>) => {
        resolve(results);
      })
      .catch((error: Error) => reject(error));
  });
}
