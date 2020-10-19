export default async function catalogItemsShuffled(context, { shopIds, tagIds, catalogBooleanFilters, count = 10 } = {}) {
  const { collections } = context;
  const { Catalog } = collections;

  if ((!shopIds || shopIds.length === 0) && (!tagIds || tagIds.length === 0)) {
    throw new ReactionError("invalid-param", "You must provide tagIds or shopIds or both");
  }

  const query = {
    "product.isDeleted": { $ne: true },
    ...catalogBooleanFilters,
    "product.isVisible": true
  };

  if (shopIds) query.shopId = { $in: shopIds };
  if (tagIds) query["product.tagIds"] = { $in: tagIds };

  const res = Catalog.aggregate([
    {$match: query},
    {$sample: {size: count}}
  ]);

  return res;
}
