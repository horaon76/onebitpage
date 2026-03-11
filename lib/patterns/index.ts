import { PatternData } from "./types";
// Creational
import singletonData from "@/content/1_LLD/1_Creational/singleton";
import factoryMethodData from "@/content/1_LLD/1_Creational/factory-method";
import abstractFactoryData from "@/content/1_LLD/1_Creational/abstract-factory";
import builderData from "@/content/1_LLD/1_Creational/builder";
import prototypeData from "@/content/1_LLD/1_Creational/prototype";
// Structural
import adapterData from "@/content/1_LLD/2_Structural/adapter";
import bridgeData from "@/content/1_LLD/2_Structural/bridge";
import compositeData from "@/content/1_LLD/2_Structural/composite";
import decoratorData from "@/content/1_LLD/2_Structural/decorator";
import facadeData from "@/content/1_LLD/2_Structural/facade";
import flyweightData from "@/content/1_LLD/2_Structural/flyweight";
import proxyData from "@/content/1_LLD/2_Structural/proxy";
// Behavioral
import chainOfResponsibilityData from "@/content/1_LLD/3_Behavioral/chain-of-responsibility";
import commandData from "@/content/1_LLD/3_Behavioral/command";
import interpreterData from "@/content/1_LLD/3_Behavioral/interpreter";
import iteratorData from "@/content/1_LLD/3_Behavioral/iterator";
import mediatorData from "@/content/1_LLD/3_Behavioral/mediator";
import mementoData from "@/content/1_LLD/3_Behavioral/memento";
import observerData from "@/content/1_LLD/3_Behavioral/observer";
import strategyData from "@/content/1_LLD/3_Behavioral/strategy";
import stateData from "@/content/1_LLD/3_Behavioral/state";
import templateMethodData from "@/content/1_LLD/3_Behavioral/template-method";
import visitorData from "@/content/1_LLD/3_Behavioral/visitor";
// SOLID
import singleResponsibilityData from "@/content/1_LLD/4_SOLID/single-responsibility";
import openClosedData from "@/content/1_LLD/4_SOLID/open-closed";
import liskovSubstitutionData from "@/content/1_LLD/4_SOLID/liskov-substitution";
import interfaceSegregationData from "@/content/1_LLD/4_SOLID/interface-segregation";
import dependencyInversionData from "@/content/1_LLD/4_SOLID/dependency-inversion";

// Registry mapping "category/pattern" slugs to PatternData.
// Add new patterns here as they are created.
const PATTERN_DATA_REGISTRY: Record<string, PatternData> = {
  // Creational
  "creational/singleton": singletonData,
  "creational/factory-method": factoryMethodData,
  "creational/abstract-factory": abstractFactoryData,
  "creational/builder": builderData,
  "creational/prototype": prototypeData,
  // Structural
  "structural/adapter": adapterData,
  "structural/bridge": bridgeData,
  "structural/composite": compositeData,
  "structural/decorator": decoratorData,
  "structural/facade": facadeData,
  "structural/flyweight": flyweightData,
  "structural/proxy": proxyData,
  // Behavioral
  "behavioral/chain-of-responsibility": chainOfResponsibilityData,
  "behavioral/command": commandData,
  "behavioral/interpreter": interpreterData,
  "behavioral/iterator": iteratorData,
  "behavioral/mediator": mediatorData,
  "behavioral/memento": mementoData,
  "behavioral/observer": observerData,
  "behavioral/state": stateData,
  "behavioral/strategy": strategyData,
  "behavioral/template-method": templateMethodData,
  "behavioral/visitor": visitorData,
  // SOLID
  "solid/single-responsibility": singleResponsibilityData,
  "solid/open-closed": openClosedData,
  "solid/liskov-substitution": liskovSubstitutionData,
  "solid/interface-segregation": interfaceSegregationData,
  "solid/dependency-inversion": dependencyInversionData,
};

/**
 * Look up interactive pattern data by category + pattern slug.
 * Returns undefined if the pattern hasn't been migrated yet.
 */
export function getPatternData(
  category: string,
  pattern: string,
): PatternData | undefined {
  return PATTERN_DATA_REGISTRY[`${category}/${pattern}`];
}

/**
 * Check whether a pattern has interactive data available.
 */
export function hasPatternData(category: string, pattern: string): boolean {
  return `${category}/${pattern}` in PATTERN_DATA_REGISTRY;
}
