<template>
  <div id="page-home">
    <loading-spinner :show="isLoading" />
    <div
      class="
        table-filter
        d-flex
        justify-content-between
        align-items-stretch
        pb-3
      "
      v-if="countries.length > 0"
    >
      <div class="input-group shadow-sm me-2">
        <span class="input-group-text">
          <i class="fas fa-search" />
        </span>
        <input
          type="text"
          class="form-control no-focus"
          :class="{
            'border-end-0':
              tableFilters.searchString && tableFilters.searchString.length > 0,
          }"
          placeholder="Type here to search"
          v-model="tableFilters.searchString"
        />
        <button
          class="input-group-text bg-transparent"
          v-if="
            tableFilters.searchString && tableFilters.searchString.length > 0
          "
          @click="tableFilters.searchString = ''"
        >
          <i class="fas fa-times" />
        </button>
      </div>
      <div class="dropdown">
        <button
          class="
            btn btn-sm btn-dark
            dropdown-toggle
            h-100
            d-flex
            justify-content-between
            align-items-center
            px-3
          "
          type="button"
          id="dropdownRegion"
          data-bs-toggle="dropdown"
        >
          <span class="me-3">Regions</span>
        </button>
        <div class="dropdown-menu">
          <div
            class="px-3 text-muted text-center fst-italic"
            v-if="regions.length == 0"
          >
            <small>No region found</small>
          </div>
          <button
            class="dropdown-item"
            v-for="region in regions"
            :key="region"
            @click.stop="toggleRegionsFilter(region)"
          >
            <i
              class="far me-2"
              :class="
                tableFilters.regions.includes(region)
                  ? 'fa-check-square'
                  : 'fa-square'
              "
            />
            {{ region }}
          </button>
        </div>
      </div>
    </div>
    <div class="row content-row" v-if="!isLoading">
      <div
        class="p-3 text-center fst-italic bg-light border rounded"
        v-if="computedCountries.length == 0"
      >
        No country found
      </div>
      <template v-else>
        <div class="table-responsive col-12 col-md column-table">
          <table class="table table-bordered table-striped align-top mb-0">
            <thead class="table-secondary thead-sticky">
              <tr>
                <th class="cell-fit">#</th>
                <th class="cell-fit text-center"></th>
                <th
                  v-for="column in tableColumns"
                  :key="`tableColumn-${column.field}`"
                  :class="{
                    sortable: column.isSortable,
                    sorted:
                      column.isSortable && tableSorting.column == column.field,
                    'sorted-desc':
                      column.isSortable &&
                      tableSorting.column == column.field &&
                      tableSorting.isDescending,
                  }"
                  @click="sortTable(column)"
                >
                  {{ column.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(country, index) in computedCountries"
                :key="`country-${country.alpha2Code}`"
              >
                <td class="cell-fit">{{ index + 1 }}</td>
                <td class="cell-fit text-center">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :key="`checkbox-${country.name}`"
                    :value="country.name"
                    v-model="selectedCountries"
                  />
                </td>
                <td class="cell-fit">
                  <img :src="country.flags.png" class="country-flag" />
                </td>
                <td>
                  <text-highlighter
                    :text="country.name"
                    :query="tableFilters.searchString"
                  />
                </td>
                <td class="cell-fit">{{ country.region }}</td>
                <td>
                  <text-highlighter
                    :text="country.capital"
                    :query="tableFilters.searchString"
                  />
                </td>
              </tr>
              <tr>
                <td
                  :colspan="tableColumns.length + 2"
                  class="text-center text-muted fst-italic"
                >
                  <small>End of list</small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-12 col-md-6 column-chart pt-3 pt-md-0">
          <div class="border rounded overflow-hidden h-100">
            <div class="px-3 py-2 bg-light border-bottom text-center">
              COUNTRY POPULATION
            </div>
            <div class="chart-container p-3">
              <p
                class="mb-0 fst-italic text-muted text-center"
                v-if="selectedCountries.length == 0"
              >
                <small>No country selected</small>
              </p>
              <bar-chart v-else :chart-data="computedChartData" class="h-100" />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from "@/components/LoadingSpinner";
import TextHighlighter from "@/components/TextHighlighter";
import BarChart from "@/components/BarChart";

export default {
  components: {
    LoadingSpinner,
    TextHighlighter,
    BarChart,
  },
  data() {
    return {
      isLoading: true,
      countries: [],
      regions: [],
      tableColumns: [
        { label: "Flag", field: "flags", isSortable: false },
        { label: "Name", field: "name", isSortable: true },
        { label: "Region", field: "region", isSortable: true },
        { label: "Capital", field: "capital", isSortable: true },
      ],
      tableSorting: {
        column: null,
        isDescending: false,
      },
      tableFilters: {
        searchString: null,
        regions: [],
      },
      selectedCountries: [],
    };
  },
  watch: {
    selectedCountries: {
      handler() {
        sessionStorage.setItem(
          "selectedCountries",
          JSON.stringify(this.selectedCountries)
        );
      },
      immediate: false,
    },
  },
  computed: {
    computedCountries() {
      let countries = [...this.countries].filter((country) =>
        this.tableFilters.regions.includes(country.region)
      );

      if (this.tableFilters.searchString) {
        countries = countries.filter(
          (country) =>
            country.name
              .toLowerCase()
              .includes(this.tableFilters.searchString.toLowerCase()) ||
            (country.capital &&
              country.capital
                .toLowerCase()
                .includes(this.tableFilters.searchString.toLowerCase()))
        );
      }

      if (this.tableSorting.column) {
        countries.sort((a, b) => {
          return this.tableSorting.isDescending
            ? a[this.tableSorting.column] < b[this.tableSorting.column]
            : a[this.tableSorting.column] > b[this.tableSorting.column];
        });
      }

      return countries;
    },
    computedChartData() {
      const sortedSelectedCountries = JSON.parse(
        JSON.stringify(this.selectedCountries)
      );

      sortedSelectedCountries.sort();

      return {
        labels: sortedSelectedCountries.map((country) => {
          const countryObject = this.countries.find((c) => c.name == country);

          if (!countryObject) return "n/a";

          return countryObject.alpha2Code + "|" + countryObject.name;
        }),
        datasets: [
          {
            label: "Population",
            minBarLength: 2,
            backgroundColor: "#a6e9d5",
            data: sortedSelectedCountries.map((country) => {
              const countryObject = this.countries.find(
                (c) => c.name == country
              );

              if (!countryObject) return 0;

              return countryObject.population / 1e6;
            }),
          },
        ],
      };
    },
  },
  methods: {
    toggleRegionsFilter(region) {
      if (this.tableFilters.regions.includes(region)) {
        this.tableFilters.regions = this.tableFilters.regions.filter(
          (filter) => filter != region
        );
      } else {
        this.tableFilters.regions.push(region);
      }
    },
    sortTable(column) {
      if (!column.isSortable) return;

      this.tableSorting.isDescending =
        this.tableSorting.column !== column.field
          ? false
          : !this.tableSorting.isDescending;

      this.tableSorting.column = column.field;
    },
    async getAllCountries() {
      this.isLoading = true;

      try {
        const response = await this.API.get("all");

        this.countries = response.data;

        this.regions = this.Helper.removeDuplicates(
          response.data.map((data) => data.region)
        ).sort((a, b) => a > b);

        this.tableFilters.regions = this.regions;
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    if (sessionStorage.getItem("selectedCountries")) {
      this.selectedCountries = JSON.parse(
        sessionStorage.getItem("selectedCountries")
      );
    }

    this.getAllCountries();
  },
};
</script>