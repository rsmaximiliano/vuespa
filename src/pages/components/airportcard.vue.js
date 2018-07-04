Vue.component("card-airport", {
  template: `<div>
    <v-card class="mb-1" v-bind:color="color">
        <v-card-text>
            <v-layout align-center wrap>
                <v-flex xs1 v-if="wait">
                    <v-progress-circular indeterminate color="red"></v-progress-circular>
                </v-flex>
                <v-flex v-if="wxdata">
                   <!--  <h3>{{airport.IATA}} {{airport.name}} {{airport.city}} {{airport.state}} {{wxdata.Meta.Timestamp}}
                    </h3>
                    <div>
                        <b>{{flightRules}}</b>
                        <b>{{wxdata.Translations.Clouds}}</b>
                    </div> -->
                    <div>
                      <h3>
                        {{wxdata.Info.IATA}} {{wxdata.Info.Name}} {{wxdata.Meta.Timestamp}}
                      </h3>
                      <div><b>{{flightRules}}</b> {{wxdata.Translations.Clouds}}</div>
                        
                        Visibility:
                        <b>{{wxdata.Translations.Visibility}}</b>
                        Wind:
                        <b>{{wxdata.Translations.Wind}}</b>
                        Temperature:
                        <b>{{wxdata.Translations.Temperature}}</b>
                        Dewpoint:
                        <b>{{wxdata.Translations.Dewpoint}}</b>
                        Altimeter:
                        <b>{{wxdata.Translations.Altimeter}}</b>
                    </div>
                   <!--  <div v-if="airport.wxdelay" v-html="airport.wxdelay"></div>
                    <span v-html="airport.weather.meta.updated"></span> -->

                </v-flex>
                <v-flex v-if="!wxdata">
                    <h4>Loading Airport Delay Information...</h4>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
</div>`,
  props: ["airportCode"],
  $_veeValidate: {
    validator: "new"
  },
  data: function() {
    return {
      wait: false,
      wxdata: { Info: {}, Translations: {}, Meta: {} },
      flightRules: {},
      airport: {
        status: {},
        weather: {
          meta: {}
        }
      }
    };
  },
  mounted() {
    this.Lookup();
    //console.log('created', this.airportCode)
  },
  computed: {
    color() {
      if (this.flightRules == "VFR") return "green white--text";
      else if (this.flightRules === "IFR") return "red white--text";
      else if (this.flightRules === "MARGINAL") return "yellow black--text";
      else {
        return "grey lighten-2 black--text";
      }
    }
  },
  methods: {
    Lookup: function() {
      //console.log('lookup', this.airportCode)

      //console.log('body', apt, delay)
      let wxurl =
        "https://avwx.rest/api/metar/K" +
        this.airportCode.toUpperCase() +
        "?options=info,translate";
      //console.log("wxurl", wxurl);
      axios.get(wxurl).then(response => {
        this.wxdata = response.data;
        this.flightRules = this.wxdata["Flight-Rules"];
        //console.log("wxresponse", response);
        this.wait = false;
      });

      /* this.wait = true;
      let xurl =
        "https://www.fly.faa.gov/flyfaa/AirportLookup.jsp?q=" +
        this.airportCode +
        "&go=1&html";
      let xproxy = "https://cors-anywhere.herokuapp.com/" + xurl;
      fetch(xproxy, { mode: "cors" }).then(response => {
        //console.log('axios', response)
        let body = response.data;
        let apt = parseIt('<th bgcolor="Silver">', body, "</TH></tr>");
        let delayApt = parseIt('COLOR="#0000CD">', body, " To see");
        let delayDep = parseIt("<b>General Departure", body, ".", true, true);
        let delayArr = parseIt("<b>General Arrival", body, "</td>", true);
        this.airport = {
          name: apt,
          delay: "false",
          wxdelay: delayApt,
          status: {},
          weather: { meta: { updated: delayDep + "<br>" + delayArr } }
        };
        if (delayApt.includes("Due to")) this.airport.delay = "true";
        if (delayDep.includes("Due to")) this.airport.delay = "true";
        if (delayArr.includes("Due to")) this.airport.delay = "true";
      }); */
    }
  }
});

var parseIt = function(
  prefix,
  str,
  suffix,
  keepPrefix = false,
  keepSuffix = false
) {
  let spos = str.indexOf(prefix);
  let epos = str.indexOf(suffix, spos);
  if (spos < 0 || epos < 0) return "";
  if (!keepPrefix) spos = spos + prefix.length;
  if (keepSuffix) epos = epos + suffix.length;
  let subText = str.substring(spos, epos);
  return subText.trim();
};
