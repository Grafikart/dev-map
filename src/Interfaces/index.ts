import { SimulationNodeDatum } from 'd3-force'

export interface ITechnology {
  name: string,
  type: string,
  require: string[]
}

export interface IJobs {
  [name: string]: string[]
}

export interface IData {
  technologies: ITechnology[]
  jobs: IJobs
}

export interface INode extends SimulationNodeDatum{
  name: string,
  type: string
}

export interface ILink {
  source: INode,
  target: INode
}
