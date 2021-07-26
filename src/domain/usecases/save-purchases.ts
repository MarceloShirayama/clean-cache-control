export interface SavePurchases {
  save: (purchases: SavePurchases.Params[]) => Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SavePurchases {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export type Params = {
    id: string
    date: Date
    value: number
  }
}
