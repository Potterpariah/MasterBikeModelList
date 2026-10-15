import index from '../data/historical-bike-page-index.json' with {type:'json'};

export const historicalBikeIndex = index;
export const historicalBrand = slug => index.brands.find(brand => brand.slug === slug) || null;
export const historicalModels = ({brandSlug='', query=''}) => {
  const term = String(query).trim().toLowerCase();
  const brands = brandSlug ? index.brands.filter(brand => brand.slug === brandSlug) : index.brands;
  return brands.flatMap(brand => brand.models.filter(model => !term || `${brand.name} ${model.name}`.toLowerCase().includes(term)).map(model => ({...model, brand_name:brand.name, brand_slug:brand.slug})));
};
export const historicalBikePath = ({brandSlug='', query=''}) => {
  const params = new URLSearchParams();
  if (brandSlug) params.set('brand', brandSlug);
  if (query) params.set('q', query);
  const text = params.toString();
  return '/bikes' + (text ? `?${text}` : '');
};
