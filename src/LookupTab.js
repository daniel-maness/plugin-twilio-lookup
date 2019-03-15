import React from 'react';
import { Actions, Tab } from '@twilio/flex-ui';

import styled from 'react-emotion';

export class LookupTab extends React.Component {
	LOOKUP_DATA_FUNCTION = "";

	constructor(props) {
		super(props);
		this.resetState();

		this.LOOKUP_DATA_FUNCTION = this.getRuntimeDomain() + "/LookupData";
		
		Actions.addListener("beforeSelectTask", () => {
			this.resetState();
		});

		Actions.addListener("afterSelectTask", () => {
			this.initLookup();
		});

		this.initLookup();
	}

	getRuntimeDomain = () => {
    let runtime = this.props.functionsUrl.replace(/(\/assets)?\/?$/, "");
    return runtime.match(/^https?/) ? runtime :  "https://"+runtime;
  };

  resetState() {
  	this.setState({
			hasLookup: false,
			name: "",
			gender: "",
			ageRange: "",
			address1: "",
			address2: "",
			city: "",
			state: "",
			postalCode: "",
			country: "",
			addressType: "",
			addressStartDate: "",
			phoneNumber: "",
			carrierName: "",
			lineType: "",
			phoneStartDate: "",
			error: null
		});
  }

  initLookup() {
  	const fromNumber = this.props.task.source.attributes.name;
  	console.log(`Fetching Lookup for ${fromNumber}...`);
  	
  	fetch(
        this.LOOKUP_DATA_FUNCTION +
          "?FromNumber=" +
          encodeURIComponent(fromNumber),
        {
          headers: {
            Accept: "application/json"
          },
          mode: "cors"
        }
      ).then(resp => {
        if (resp.ok) {
        	resp.json().then(body => {
						const lookup = body.result;
						if (lookup) {
							this.setState({ 
								hasLookup: true,
								phoneNumber: this.props.task.source.attributes.name,
								carrierName: lookup.carrier,
								lineType: lookup.line_type
	          	});
						} else {
							this.setState({
		        		hasLookup: false
		        	});
		        	return;
						}
      			
      			if (lookup.belongs_to.length > 0) {
      				const belongsTo = lookup.belongs_to[lookup.belongs_to.length - 1];
      				this.setState({
      					name: belongsTo.name,
								gender: belongsTo.gender,
								ageRange: belongsTo.age_range,
								phoneStartDate: belongsTo.link_to_phone_start_date
      				});
      			}

      			if (lookup.current_addresses.length > 0) {
      				const currentAddress = lookup.current_addresses[lookup.current_addresses.length - 1];
      				this.setState({
								address1: currentAddress.street_line_1,
								address2: currentAddress.street_line_2,
								city: currentAddress.city,
								state: currentAddress.state_code,
								postalCode: currentAddress.postal_code,
								country: currentAddress.country_code,
								addressType: currentAddress.delivery_point,
								addressStartDate: currentAddress.link_to_person_start_date,
      				});
      			}
        	});
        } else {
        	this.resetState();
        }
      });
  }

	render() {
		const Container = styled("div")`
      display: flex;
      flex-direction: column;
      flex: 1 0 auto;
      border-style: solid;
      border-width: 0 0 0 0px;
      iframe {
        border: none;
        display: flex;
        flex: 1 0 auto;
      }
    `;

    return (
    	<Tab>
    	<Container>
    		{this.state.hasLookup &&
	    		<div style={{ margin: "1em" }}>
		    		<div>
		    			<h1>Caller Info</h1>
				  		<h2>Name</h2>
				  		<p>{this.state.name}</p>
				  		<h2>Gender</h2>
				  		<p>{this.state.gender}</p>
				  		<h2>Age Range</h2>
				  		<p>{this.state.ageRange}</p>
				  	</div>
				  	<div>
				  		<hr style={{ marginBottom: "1em" }} />
				  		<h1>Location Info</h1>
				  		<h2>Address</h2>
				  		<p>
				  			{this.state.address1}
				  			{this.state.address1 &&
				  				<br />
				  			}
				  			{this.state.address2}
				  			{this.state.address2 &&
				  				<br />
				  			}
				  			{this.state.city}, {this.state.state} {this.state.postalCode}
				  		</p>
				  		<h2>Type</h2>
				  		<p>{this.state.addressType}</p>
				  		<h2>Start Date</h2>
				  		<p>{this.state.addressStartDate}</p>
				  	</div>
				  	<div>
				  		<hr style={{ marginBottom: "1em" }} />
				  		<h1>Phone Info</h1>
				  		<h2>Number</h2>
				  		<p>{this.state.phoneNumber}</p>
				  		<h2>Carrier Name</h2>
				  		<p>{this.state.carrierName}</p>
				  		<h2>Line Type</h2>
				  		<p>{this.state.lineType}</p>
				  		<h2>Start Date</h2>
				  		<p>{this.state.phoneStartDate}</p>
		    		</div>
	    		</div>
	    	}
    	</Container>
    	</Tab>
    );
	}
}
