import { SimulationNodeDatum } from 'd3-force'

export interface ITutorial {
  name: string
  url: string
}

export interface ITechnology {
  name: string,
  type: string,
  desc: string,
  require: string[]
  tutorials?: ITutorial[],
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
  type: string,
  desc: string
}

export interface ILink {
  source: INode,
  target: INode
}
