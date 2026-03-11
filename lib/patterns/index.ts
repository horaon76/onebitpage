import { PatternData } from "./types";
// Creational
import singletonData from "@/content/1_LLD/1_Creational/singleton";
import factoryMethodData from "@/content/1_LLD/1_Creational/factory-method";
import abstractFactoryData from "@/content/1_LLD/1_Creational/abstract-factory";
import builderData from "@/content/1_LLD/1_Creational/builder";
import prototypeData from "@/content/1_LLD/1_Creational/prototype";
// Structural
import adapterData from "@/content/1_LLD/2_Structural/adapter";
import decoratorData from "@/content/1_LLD/2_Structural/decorator";
import facadeData from "@/content/1_LLD/2_Structural/facade";
import proxyData from "@/content/1_LLD/2_Structural/proxy";
import compositeData from "@/content/1_LLD/2_Structural/composite";
// Behavioral
import observerData from "@/content/1_LLD/3_Behavioral/observer";
import strategyData from "@/content/1_LLD/3_Behavioral/strategy";
import commandData from "@/content/1_LLD/3_Behavioral/command";
import stateData from "@/content/1_LLD/3_Behavioral/state";
import templateMethodData from "@/content/1_LLD/3_Behavioral/template-method";
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
  "structural/decorator": decoratorData,
  "structural/facade": facadeData,
  "structural/proxy": proxyData,
  "structural/composite": compositeData,
  // Behavioral
  "behavioral/observer": observerData,
  "behavioral/strategy": strategyData,
  "behavioral/command": commandData,
  "behavioral/state": stateData,
  "behavioral/template-method": templateMethodData,
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
