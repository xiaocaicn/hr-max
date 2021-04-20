<template>
  <div class="detailBox">
    <div class="detailTop">
      <div>
        <img src="@/assets/common/img.jpeg" width="100" height="100" alt>
      </div>
      <div>
        <b>{{ sizeForm.user.username }}</b>
        <span :class="dutyStatus ? 'job-txt-green' : 'job-txt-red'">{{
          dutyStatusTxt
        }}</span>
        <br>
        <p>
          <span>最新工资基数</span>
          &emsp;&emsp;
          <span>入职时间 {{ sizeForm.user.timeOfEntry | formatDate }}</span>
          &emsp;&emsp;
          <span>联系电话 {{ sizeForm.user.mobile }}</span>
        </p>
        <br>
        <p>
          本月不缴纳社保
          <el-switch
            v-model="isPaySocialInMonth"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />&emsp;&emsp; 本月不缴纳公积金
          <el-switch
            v-model="isPayProvidentInMonth"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </p>
      </div>
    </div>
    <el-card>
      <el-form
        :model="sizeForm.userSocialSecurity"
        :rules="rules"
        size="mini"
        label-width="100px"
      >
        <el-form-item label="参保城市" prop="participatingInTheCity">
          <el-select
            v-model="sizeForm.userSocialSecurity.participatingInTheCity"
            value-key="id"
            placeholder="请选择参保城市"
            @change="socialSecurityCityChange"
          >
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="社保类型" prop="socialSecurityType">
          <el-select
            v-model="sizeForm.userSocialSecurity.socialSecurityType"
            value-key="id"
            placeholder="请选择参保城市"
          >
            <el-option label="首次开户" :value="1" />
            <el-option label="非首次开户" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="户籍类型" prop="householdRegistrationType">
          <el-select
            v-model="sizeForm.userSocialSecurity.householdRegistrationType"
            value-key="id"
            placeholder="请选择参保城市"
          >
            <el-option label="本市城镇" :value="1" />
            <el-option label="本市农村" :value="2" />
            <el-option label="外阜城镇" :value="3" />
            <el-option label="外阜农村" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="社保基数" prop="socialSecurityBase">
          <el-input
            v-model="sizeForm.userSocialSecurity.socialSecurityBase"
            style="width: 36%"
          />（基数范围是3387 ~ 25401）
        </el-form-item>
        <el-form-item label="工伤比例" prop="industrialInjuryRatio">
          <el-input
            v-model="sizeForm.userSocialSecurity.industrialInjuryRatio"
            style="width: 36%"
          />（比例范围是0.2％ ~ 3％，推荐0.2％）
        </el-form-item>
        <el-form-item label="社保缴纳">
          <el-form-item
            label="个人"
            label-width="74px"
            style="display: inline-block"
          >
            <el-input
              v-model="personalPayment"
              placeholder="个人"
              :disabled="true"
              inline="true"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="公司"
            label-width="74px"
            style="display: inline-block"
          >
            <el-input
              v-model="companyPayment"
              placeholder="公司"
              :disabled="true"
              inline="true"
              style="width: 100%"
              size="small"
            />
          </el-form-item>
          <el-table :data="computePaymentItemList">
            <el-table-column label="缴费项目" prop="name" />
            <el-table-column label="企业基数">
              <template slot-scope="{ row }">
                <span v-show="row.switchCompany">{{
                  sizeForm.userSocialSecurity.socialSecurityBase
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="企业比例">
              <template slot-scope="{ row }">
                <span v-show="row.switchCompany">{{ row.scaleCompany }}%</span>
              </template>
            </el-table-column>
            <el-table-column label="企业缴纳">
              <template slot-scope="{ row }">
                <el-input
                  v-show="row.switchCompany"
                  v-model="row.companyPay"
                  :disabled="true"
                />
              </template>
            </el-table-column>
            <el-table-column label="个人基数">
              <template slot-scope="{ row }">
                <span v-show="row.switchPersonal">{{
                  sizeForm.userSocialSecurity.socialSecurityBase
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="个人比例">
              <template slot-scope="{ row }">
                <span
                  v-show="row.switchPersonal"
                >{{ row.scalePersonal }}%</span>
              </template>
            </el-table-column>
            <el-table-column label="个人缴纳">
              <template slot-scope="{ row }">
                <el-input
                  v-show="row.switchPersonal"
                  v-model="row.personalPay"
                  :disabled="true"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="社保备注">
          <el-input
            v-model="sizeForm.userSocialSecurity.socialSecurityNotes"
            placeholder="1-300字符"
            type="textarea"
            show-word-limit
            maxlength="300"
            :rows="2"
            style="width: 38%"
          />
        </el-form-item>
        <el-form-item label="公积金城市" prop="providentFundCity">
          <el-select
            v-model="sizeForm.userSocialSecurity.providentFundCity"
            placeholder="请选择公积金城市"
            value-key="id"
          >
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公积金基数" prop="providentFundBase">
          <el-input
            v-model="sizeForm.userSocialSecurity.providentFundBase"
            style="width: 38%"
            type="number"
          />（基数范围是2273 ~ 25401）
        </el-form-item>
        <el-form-item label="企业比例" prop="enterpriseProportion">
          <el-input
            v-model="sizeForm.userSocialSecurity.enterpriseProportion"
            placeholder="12"
            style="width: 38%"
            type="number"
          />（比例范围是5％ ~ 12％，推荐12％ ）
        </el-form-item>
        <el-form-item label="个人比例" prop="personalProportion">
          <el-input
            v-model="sizeForm.userSocialSecurity.personalProportion"
            placeholder="12"
            style="width: 38%"
            type="number"
          />（比例范围是5％ ~ 12％，推荐12％ ）
        </el-form-item>
        <el-form-item label="公积金缴纳">
          <el-form-item
            label="个人"
            label-width="50px"
            style="display: inline-block"
            prop="personalProvidentFundPayment"
          >
            <el-input
              v-model="sizeForm.userSocialSecurity.personalProvidentFundPayment"
              placeholder="个人"
              inline="true"
              type="number"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="公司"
            label-width="50px"
            style="display: inline-block"
            prop="enterpriseProvidentFundPayment"
          >
            <el-input
              v-model="
                sizeForm.userSocialSecurity.enterpriseProvidentFundPayment
              "
              placeholder="公司"
              inline="true"
              type="number"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item style="display: inline-block">
            <span>（为自动测算结果，可手动调整）</span>
          </el-form-item>
        </el-form-item>
        <el-form-item label="公积金备注">
          <el-input
            v-model="sizeForm.userSocialSecurity.providentFundNotes"
            placeholder="1-300个字符"
            type="textarea"
            :rows="2"
            style="width: 38%"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="btnOK">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getCityList } from '@/api/common'
import { getContent, getPaymentItemList, saveContent } from '@/api/social'

export default {
  data() {
    const validateSocialSecurityBase = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入社保基数'))
      } else if (value < 3387 || value > 25401) {
        callback(new Error('请不要超出范围，基数范围是3387 ~ 25401'))
      } else {
        callback()
      }
    }
    const validateIndustrialInjuryRatio = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入工伤比例'))
      } else if (value < 0.2 || value > 3) {
        callback(new Error('请不要超出范围，比例范围是0.2％ ~ 3％'))
      } else {
        callback()
      }
    }
    const validateProvidentFundBase = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入公积金基数'))
      } else if (value < 2273 || value > 25401) {
        callback(new Error('请不要超出范围，基数范围是2273 ~ 25401'))
      } else {
        callback()
      }
    }
    const validateEnterpriseProportion = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入企业比例'))
      } else if (value < 5 || value > 12) {
        callback(new Error('请不要超出范围，比例范围是5％ ~ 12％'))
      } else {
        callback()
      }
    }
    const validatePersonalProportion = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入个人比例'))
      } else if (value < 5 || value > 12) {
        callback(new Error('请不要超出范围，比例范围是5％ ~ 12％'))
      } else {
        callback()
      }
    }
    return {
      isPaySocialInMonth: false,
      isPayProvidentInMonth: false,
      personalPayment: 0.0,
      companyPayment: 0.0,
      sizeForm: {
        user: {},
        userSocialSecurity: {
          participatingInTheCity: '',
          socialSecurityType: '',
          householdRegistrationType: '',
          socialSecurityBase: '',
          industrialInjuryRatio: '',
          socialSecurityNotes: '',
          providentFundCity: '',
          providentFundBase: '',
          enterpriseProportion: '',
          personalProportion: '',
          personalProvidentFundPayment: '',
          enterpriseProvidentFundPayment: '',
          providentFundNotes: ''
        }
      },
      rules: {
        participatingInTheCity: [
          { required: true, message: '请选择参保城市1234', trigger: 'change' }
        ],
        socialSecurityType: [
          { required: true, message: '请选择社保类型', trigger: 'change' }
        ],
        householdRegistrationType: [
          { required: true, message: '请选择户籍类型', trigger: 'change' }
        ],
        socialSecurityBase: [
          {
            required: true,
            validator: validateSocialSecurityBase,
            trigger: 'blur'
          }
        ],
        industrialInjuryRatio: [
          {
            required: true,
            validator: validateIndustrialInjuryRatio,
            trigger: 'blur'
          }
        ],
        providentFundCity: [
          { required: true, message: '请选择公积金城市', trigger: 'change' }
        ],
        providentFundBase: [
          {
            required: true,
            validator: validateProvidentFundBase,
            trigger: 'blur'
          }
        ],
        enterpriseProportion: [
          {
            required: true,
            validator: validateEnterpriseProportion,
            trigger: 'blur'
          }
        ],
        personalProportion: [
          {
            required: true,
            validator: validatePersonalProportion,
            trigger: 'blur'
          }
        ],
        enterpriseProvidentFundPayment: [
          {
            required: true,
            message: '请输入公司公积金缴纳数额',
            trigger: 'change'
          }
        ],
        personalProvidentFundPayment: [
          {
            required: true,
            message: '请输入个人公积金缴纳数额',
            trigger: 'change'
          }
        ]
      },
      cityList: [],
      paymentItemList: []
    }
  },
  computed: {
    dutyStatusTxt() {
      return this.sizeForm.user.inServiceStatus === 1 ? '在职' : '离职'
    },
    dutyStatus() {
      return this.sizeForm.user.inServiceStatus === 1
    },
    computePaymentItemList() {
      let personalTotal = Number(0)
      let companyTotal = Number(0)
      this.paymentItemList.forEach((item) => {
        if (item.name === '工伤' && item.switchCompany) {
          item.scaleCompany = this.sizeForm.userSocialSecurity.industrialInjuryRatio
        }
        if (item.switchCompany) {
          item.companyPay = parseFloat(
            (this.sizeForm.userSocialSecurity.socialSecurityBase *
              item.scaleCompany) /
              100
          ).toFixed(2)
          companyTotal = Number(companyTotal + Number(item.companyPay))
        }
        if (item.switchPersonal) {
          item.personalPay = parseFloat(
            (this.sizeForm.userSocialSecurity.socialSecurityBase *
              item.scalePersonal) /
              100
          ).toFixed(2)
          personalTotal = Number(personalTotal + Number(item.personalPay))
        }
      })
      return this.paymentItemList
    }
  },
  watch: {
    'sizeForm.userSocialSecurity.providentFundBase': function() {
      this.changeProvidentFundPayment()
    },
    'sizeForm.userSocialSecurity.enterpriseProportion': function() {
      this.changeProvidentFundPayment()
    },
    'sizeForm.userSocialSecurity.personalProportion': function() {
      this.changeProvidentFundPayment()
    }
  },
  created() {
    this.getCityList()
    this.getContent()
  },
  methods: {
    async getCityList() {
      const res = await getCityList()
      this.cityList = res
    },
    async getContent() {
      // debugger
      const res = await getContent(this.$route.params.id)
      //   const { userSocialSecurity, user } = await getContent(this.$route.params.id)
      //   this.sizeForm.userSocialSecurity = userSocialSecurity
      //   this.sizeForm.user = user
      this.sizeForm = res
      this.sizeForm.userId = this.$route.params.id
      //   this.sizeForm = { ...this.sizeForm, user, userSocialSecurity }
      console.log(this.sizeForm)
      //   debugger
      this.isPaySocialInMonth =
        this.sizeForm.userSocialSecurity
          .enterprisesPaySocialSecurityThisMonth === 1
      this.isPayProvidentInMonth =
        this.sizeForm.userSocialSecurity
          .enterprisesPayTheProvidentFundThisMonth === 1
      const city = {
        id: this.sizeForm.userSocialSecurity.participatingInTheCityId,
        name: this.sizeForm.userSocialSecurity.participatingInTheCity
      }
      this.getPaymentItemList(city)
    },
    async getPaymentItemList(city) {
      const res = await getPaymentItemList(city.id)
      // console.log(res)
      this.paymentItemList = res
    },
    socialSecurityCityChange(city) {
      console.log(city)
      this.sizeForm.userSocialSecurity.participatingInTheCity = city
      this.getPaymentItemList(city)
    },
    changeProvidentFundPayment() {
      this.sizeForm.userSocialSecurity.enterpriseProvidentFundPayment = parseFloat(
        (this.sizeForm.userSocialSecurity.enterpriseProportion *
          this.sizeForm.userSocialSecurity.providentFundBase) /
          100
      ).toFixed(2)
      this.sizeForm.userSocialSecurity.personalProvidentFundPayment = parseFloat(
        (this.sizeForm.userSocialSecurity.personalProportion *
          this.sizeForm.userSocialSecurity.providentFundBase) /
          100
      ).toFixed(2)
    },
    async btnOK() {
      this.sizeForm.userSocialSecurity.enterprisesPaySocialSecurityThisMonth = this.isPaySocialInMonth ? 1 : 0
      this.sizeForm.userSocialSecurity.enterprisesPayTheProvidentFundThisMonth = this.isPayProvidentInMonth ? 1 : 0
      this.sizeForm.userSocialSecurity.userId = this.sizeForm.userId
      const cCity = this.sizeForm.userSocialSecurity.participatingInTheCity
      const fCity = this.sizeForm.userSocialSecurity.participatingInTheCity
      this.sizeForm.userSocialSecurity.participatingInTheCity = cCity.name
      this.sizeForm.userSocialSecurity.participatingInTheCityId = cCity.id
      this.sizeForm.userSocialSecurity.providentFundCity = fCity.name
      this.sizeForm.userSocialSecurity.providentFundCityId = fCity.id
      await saveContent(this.sizeForm.userSocialSecurity)
      this.$message.success('保存成功')
      console.log(this.sizeForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.detailBox {
  margin: 20px;
  .detailTop {
    background: #fff;
    padding: 15px;
    margin-bottom: 10px;
    display: flex;
    box-shadow: 1px 2px 4px #cccccc;
    img {
      border-radius: 50%;
      margin-right: 40px;
      box-shadow: 1px 2px 4px #cccccc;
    }
  }
  .detailContentBox {
    margin: 15px 0;
    padding: 15px;
    background: #fff;
  }
}
.job-txt-green,
.job-txt-red {
  display: inline-block;
  padding: 3px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
}
.job-txt-green {
  background: #67c23a;
  //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.job-txt-red {
  //   padding: 20px;
  background: #f56c6c;
  //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
