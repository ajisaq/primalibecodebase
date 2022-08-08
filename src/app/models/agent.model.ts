
import { Airline } from './airline.model';
import { AgentType } from './agent-type.model';
import { Country } from './country.model';
import { Currency } from './currency.model';
import { City } from './city.model';

export class Agent
{
    iri: string;
    id: number;
    code: string;
    sineNumeric: number;
    sineAlpha: string;
    shortName: string;
    dutyCode: string;
    fullName: string;
    email: string;
    agentType: AgentType;
    airline: Airline;
    country: Country;
    city: City;
    currency: Currency;
    subOffice: string;
    issueOfficeCode: string;
    issueAgentCode: string;
    securityLevel: number;

    /**
     * Constructor
     *
     * @param agent
     */
    constructor(agent?:any)
    {
        agent = agent || {};
        this.iri = agent instanceof Agent? agent.iri : agent['@id']? agent['@id'] : null;
        this.id         = agent.id || null;//FuseUtils.generateGUID();
        this.code      = agent.code || null;
        this.sineNumeric   = agent.sine_numeric || null;
        this.sineAlpha     = agent.sine_alpha || null;
        this.dutyCode     = agent.duty_code || null;
        this.shortName     = agent.short_name || null;
        this.fullName      = agent.full_name || null;
        this.email      = agent.email || null;
        this.agentType     = new AgentType(agent.agent_type || {});
        this.airline        = new Airline(agent.airline || {});
        this.country        = new Country(agent.country || {});
        this.city   = new City(agent.city || {});
        this.currency = new Currency(agent.currency || {});
        this.subOffice   = agent.sub_office || null;
        this.issueOfficeCode   = agent.issue_office_code || null;
        this.issueAgentCode    = agent.issue_agent_code || null;
        this.securityLevel = agent.security_level || null;
    }

}