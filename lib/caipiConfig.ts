export const DEFAULT_CAIPI_CONFIG = {
  ordering_open: true,
  disabled_flavors: [] as string[],
  supplement_bonbons_enabled: true,
  supplement_bonbons_price: 1,
  supplement_sirop_enabled: true,
  supplement_sirop_price: 2,
  price_classique_500ml: 10,
  price_classique_700ml: 12,
  price_classique_1litre: 18,
  price_fruitee_500ml: 12,
  price_fruitee_700ml: 14,
  price_fruitee_1litre: 20,
};

export type CaipiConfig = typeof DEFAULT_CAIPI_CONFIG;
