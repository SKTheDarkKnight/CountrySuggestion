import { create } from "domain";
import { debug } from "util";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class CountrySuggestion implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;

	private _inputElement: HTMLInputElement;

	private _countryList: HTMLDataListElement;

	private _labelElement: HTMLLabelElement;

	private _context: ComponentFramework.Context<IInputs>;

	private _countryValue: string;

	private notifyOutputChanged: () => void;

	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {

		this._container = container;
		this._context = context;
		this.notifyOutputChanged = notifyOutputChanged;
		this._container = document.createElement('div');
		this._inputElement = document.createElement('input');
		this._inputElement.setAttribute('type', 'text');
		this._inputElement.setAttribute('id', 'txtCountry');
		this._inputElement.setAttribute('list', 'ddlCountry');
		this._inputElement.setAttribute('value', '');
		this._inputElement.addEventListener('blur', this.refreshData.bind(this));

		this._labelElement = document.createElement('label');
		this._labelElement.setAttribute('id', 'lblCountryName');
		this._labelElement.setAttribute('hidden','hidden');
		

		this._countryList = document.createElement('datalist');
		this._countryList.setAttribute('id', 'ddlCountry');
		

		var months = context.resources.getString('CountryList');
		var tempMonths = months.split(',');
		var options = '';
		tempMonths.forEach((item) => {
			options += '<option value="' + item.replace('"', '').replace('"', '').trim() + '" />';
		})

		this._countryList.innerHTML = options;
		this._countryValue = context.parameters.country.raw!;
		this._inputElement.setAttribute("value", context.parameters.country.formatted ? context.parameters.country.formatted : "");
		this._labelElement.innerHTML = context.parameters.country.formatted ? context.parameters.country.formatted : "";

		this._container.appendChild(this._inputElement);
		this._container.appendChild(this._labelElement);
		this._container.appendChild(this._countryList);
		container.appendChild(this._container);
	}

	public refreshData(evt: Event): void {
		this._countryValue = this._inputElement.value;
		this._labelElement.innerHTML = this._inputElement.value;
		this.notifyOutputChanged();
    }

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		debugger;
		this._countryValue = context.parameters.country.raw!;
		this._context = context;
		this._inputElement.setAttribute("value", context.parameters.country.formatted ? context.parameters.country.formatted : "");
		this._labelElement.innerHTML = context.parameters.country.formatted ? context.parameters.country.formatted : "";
	}

	/**
	 * It is called by the framework prior to a control receiving new data.
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {
			country: this._countryValue
		};
	}

	/**
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
		this._inputElement.removeEventListener("blur", this.refreshData);
	}
}
