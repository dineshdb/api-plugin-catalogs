import { decodeShopOpaqueId, decodeTagOpaqueId } from "../../xforms/id.js";
import xformCatalogBooleanFilters from "../../utils/catalogBooleanFilters.js";

/**
 * @name Query/catalogItems
 * @method
 * @memberof Catalog/GraphQL
 * @summary Get a list of catalogItems
 * @param {Object} _ - unused
 * @param {ConnectionArgs} args - an object of all arguments that were sent by the client
 * @param {String[]} [args.shopIds] - limit to catalog items for these shops
 * @param {String[]} [args.tagIds] - limit to catalog items with this array of tags
 * @param {Object[]} [args.booleanFilters] - Array of boolean filter objects with `name` and `value`
 * @param {Object} context - an object containing the per-request state
 * @param {Object} info Info about the GraphQL request
 * @returns {Promise<Object>} A CatalogItemConnection object
 */
export default async function catalogItemsShuffled(_, args, context) {
  const { shopIds: opaqueShopIds, tagIds: opaqueTagIds, booleanFilters, count } = args;

  const shopIds = opaqueShopIds && opaqueShopIds.map(decodeShopOpaqueId);
  const tagIds = opaqueTagIds && opaqueTagIds.map(decodeTagOpaqueId);

  let catalogBooleanFilters = {};
  if (Array.isArray(booleanFilters) && booleanFilters.length) {
    catalogBooleanFilters = await xformCatalogBooleanFilters(context, booleanFilters);
  }

  const query = await context.queries.catalogItemsShuffled(context, {
    catalogBooleanFilters,
    shopIds,
    tagIds,
    count,
  });

  const nodes = await query.toArray();
  const pageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
  };

  return { nodes, pageInfo, totalCount: nodes.length };
}
