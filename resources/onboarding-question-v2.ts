import {
  ageNode,
  reviewInvestment,
  DTPDcoverageNode,
  emegencyFundNode,
  advisorGenderNode,
  illnessCoverageNode,
  insuranceCoverageNode,
  investingNode,
  investmentAdvise,
  advisorLanguageNode,
  planningArea,
  preferredCompanyNode,
  QNode,
  advisorReligionNode,
  retiredQuestionNode,
  specializationNodes,
  startingFamilyNode,
  supportingParentNode,
  userNameNode,
  welcome,
  startRetirementNode,
  reviewRetirementNode,
  considerRetirementNode,
  lagacyPlanningNode,
  DTPDProtection,
  insuranceFamilarity,
  retirementGoals,
  advisorAgeNode,
  personalQuestionsCover,
  additionalSpecification,
} from "./questions";

export function getQuestions() {
  const welcomeN = welcome();
  // welcome question
  welcomeN.next = function (answer) {
    if (answer[this.key] === "KNOW") {
      const n = getUnsupervisedQuestions();
      n.prev = function () {
        return welcomeN;
      };
      return n;
    }
    const n = getSupervisedQuestions();
    n.prev = function () {
      return welcomeN;
    };
    return n;
  };
  return welcomeN;
}

function getUnsupervisedQuestions() {
  // planning area
  // This one is complicated because of JS closures. We need to create a new function for each node
  const ageN = ageNode();
  const planningNode = planningArea();
  const advisorPreference = getAdvisorPreferenceQuestions();
  ageN.next = function (answer) {
    return planningNode;
  }
  planningNode.next = function (answer) {
    let current: QNode = advisorPreference;
    let prev: QNode = advisorPreference;
    for (const name of answer[this.key] ?? []) {
      if (specializationNodes[name]) {
        current = specializationNodes[name]();
      }
      if (current) {
        current.next = (function () {
          const captured = prev;
          return function (answer) {
            return captured;
          };
        })();
      }
      if (prev) {
        prev.prev = (function () {
          const captured = current;
          return function (answer) {
            return captured;
          };
        })();
      }
      prev = current;
    }
    current.prev = function () {
      return planningNode;
    };
    return current;
  };
  planningNode.prev = function () {
    return ageN;
  }

  return ageN;
}

function getSupervisedQuestions() {
  const ageN = ageNode();
  ageN.next = function (answer) {
    // retirement
    if (["A4", "A5"].includes(answer[this.key])) {
      const retiredN = retiredQuestionNode();
      retiredN.prev = function () {
        return ageN;
      };
      retiredN.next = function (answer) {
        if (answer[this.key] === "YES") {
          return getGoldenYearsQuestions();
        } else {
          return getPreRetiredQuestions();
        }
      };
      return retiredN;
    }

    // family and supporting parents
    const startingFamilyN = startingFamilyNode();
    const supportingParentN = supportingParentNode();
    startingFamilyN.prev = function () {
      return ageN;
    };
    startingFamilyN.next = function (answer) {
      return supportingParentN;
    };
    supportingParentN.prev = function () {
      return startingFamilyN;
    };
    supportingParentN.next = function (answer) {
      if (answer["haveParents"] === "NO" && answer["haveFamily"] === "YES") {
        const n = getStartingFamilyQuestions();
        // n.prev = function(){ return this}
        return n;
      }
      if (answer["haveParents"] === "NO" && answer["haveFamily"] === "NO") {
        const n = getFreshEntranceQuestions();
        n.prev = function () {
          return supportingParentN;
        };
        return n;
      }
      const n = getSupportingParentQuestions();
      // n.prev = function(){ return this}
      return n;
    };
    return startingFamilyN;
  };
  return ageN;
}

function getFreshEntranceQuestions() {
  const emegencyFundN = emegencyFundNode();
  const DTPDN = DTPDcoverageNode();
  const illnessN = illnessCoverageNode();
  const insuranceN = insuranceCoverageNode();
  const investingN = investingNode("15%");
  emegencyFundN.next = function (answer) {
    return DTPDN;
  };
  DTPDN.prev = function () {
    return emegencyFundN;
  };
  DTPDN.next = function (answer) {
    return illnessN;
  };
  illnessN.prev = function () {
    return DTPDN;
  };
  illnessN.next = function (answer) {
    return insuranceN;
  };
  insuranceN.prev = function () {
    return illnessN;
  };
  insuranceN.next = function (answer) {
    return investingN;
  };
  investingN.prev = function () {
    return insuranceN;
  };
  investingN.next = function (answer) {
    if (answer[this.key] === "YES") {
      const cn = reviewInvestment();
      cn.prev = function () {
        return investingN;
      };
      cn.next = function (answer) {
        const n = getAdvisorPreferenceQuestions();
        n.prev = function () {
          return cn;
        };
        return n;
      };
      return cn;
    }
    const invN = investmentAdvise('15%+');
    invN.prev = function () {
      return investingN;
    };
    invN.next = function (answer) {
      const n = getAdvisorPreferenceQuestions();
      n.prev = function () {
        return invN;
      };
      return n;
    };
    return invN;
  };
  return emegencyFundN;
}

function getStartingFamilyQuestions() {
  const emegencyFundN = emegencyFundNode();
  const DTPDN = DTPDcoverageNode();
  const illnessN = illnessCoverageNode();
  const insuranceN = insuranceCoverageNode();
  const investingN = investingNode("10%");
  emegencyFundN.next = function (answer) {
    return DTPDN;
  };
  DTPDN.prev = function () {
    return emegencyFundN;
  };
  DTPDN.next = function (answer) {
    return illnessN;
  };
  illnessN.prev = function () {
    return DTPDN;
  };
  illnessN.next = function (answer) {
    return insuranceN;
  };
  insuranceN.prev = function () {
    return illnessN;
  };
  insuranceN.next = function (answer) {
    return investingN;
  };
  investingN.prev = function () {
    return insuranceN;
  };
  investingN.next = function (answer) {
    if (answer[this.key] === "YES") {
      const cn = reviewInvestment();
      cn.prev = function () {
        return investingN;
      };
      cn.next = function (answer) {
        const n = getRetirementPlanningQuestions();
        n.prev = function () {
          return cn;
        };
        return n;
      };
      return cn;
    }
    const invN = investmentAdvise('10%+');
    invN.prev = function () {
      return investingN;
    };
    invN.next = function (answer) {
      const n = getRetirementPlanningQuestions();
      n.prev = function () {
        return invN;
      };
      return n;
    };
    return invN;
  };
  return emegencyFundN;
}

function getSupportingParentQuestions() {
  const emegencyFundN = emegencyFundNode();
  const DTPDN = DTPDcoverageNode();
  const illnessN = illnessCoverageNode();
  const insuranceN = insuranceCoverageNode();
  const investingN = investingNode("10%");
  emegencyFundN.next = function (answer) {
    return DTPDN;
  };
  DTPDN.prev = function () {
    return emegencyFundN;
  };
  DTPDN.next = function (answer) {
    return illnessN;
  };
  illnessN.prev = function () {
    return DTPDN;
  };
  illnessN.next = function (answer) {
    return insuranceN;
  };
  insuranceN.prev = function () {
    return illnessN;
  };
  insuranceN.next = function (answer) {
    return investingN;
  };
  investingN.prev = function () {
    return insuranceN;
  };
  investingN.next = function (answer) {
    if (answer[this.key] === "YES") {
      const cn = reviewInvestment();
      cn.prev = function () {
        return investingN;
      };
      cn.next = function (answer) {
        const n = getRetirementAndLagacyPlanningQuestions();
        n.prev = function () {
          return cn;
        };
        return n;
      };
      return cn;
    }
    const invN = investmentAdvise('10%+');
    invN.prev = function () {
      return investingN;
    };
    invN.next = function (answer) {
      const n = getRetirementAndLagacyPlanningQuestions();
      n.prev = function () {
        return invN;
      };
      return n;
    };
    return invN;
  };
  return emegencyFundN;
}

function getPreRetiredQuestions() {
  const emergencyFundN = emegencyFundNode();
  const investingN = investingNode("10%");
  emergencyFundN.next = function (answer) {
    return investingN;
  };
  investingN.prev = function () {
    return emergencyFundN;
  };
  investingN.next = function (answer) {
    if (answer[this.key] === "YES") {
      const cn = reviewInvestment();
      cn.prev = function () {
        return investingN;
      };
      cn.next = function (answer) {
        const n = getRetirementLagacyAndProtectionQuestions();
        n.prev = function () {
          return cn;
        };
        return n;
      };
      return cn;
    }
    const invN = investmentAdvise('10%+', true);
    invN.prev = function () {
      return investingN;
    };
    invN.next = function (answer) {
      const n = getRetirementLagacyAndProtectionQuestions();
      n.prev = function () {
        return invN;
      };
      return n;
    };
    return invN;
  };
  return emergencyFundN;
}

function getGoldenYearsQuestions() {
  const emegencyFundN = emegencyFundNode();
  const retirementGoalsN = retirementGoals();
  const lagacy = lagacyPlanningNode();
  const DTPDN = DTPDProtection();
  const insuranceFamilarityN = insuranceFamilarity();
  emegencyFundN.next = function (answer) {
    return retirementGoalsN;
  }
  retirementGoalsN.prev = function () {
    return emegencyFundN;
  }
  retirementGoalsN.next = function (answer) {
    return lagacy;
  }
  lagacy.prev = function () {
    return retirementGoalsN;
  }
  lagacy.next = function (answer) {
    return DTPDN;
  }
  DTPDN.prev = function () {
    return lagacy;
  }
  DTPDN.next = function (answer) {
    return insuranceFamilarityN;
  }
  insuranceFamilarityN.prev = function () {
    return DTPDN;
  }
  insuranceFamilarityN.next = function (answer) {
    const adv = getAdvisorPreferenceQuestions();
    adv.prev = function () {
      return insuranceFamilarityN;
    }
    return adv;
  }
  return emegencyFundN
}

function getAdvisorPreferenceQuestions() {
  const cover = personalQuestionsCover();
  const religionN = advisorReligionNode();
  const genderN = advisorGenderNode();
  const languageN = advisorLanguageNode();
  const ageN = advisorAgeNode();
  const preferredCompanyN = preferredCompanyNode();
  const userNameN = userNameNode();
  const additionalScope = additionalSpecification();
  cover.next = function (answer) {
    return religionN;
  };
  religionN.prev = function () {
    return cover;
  }
  religionN.next = function (answer) {
    return genderN;
  };

  genderN.prev = function () {
    return religionN;
  };
  genderN.next = function (answer) {
    return languageN;
  };

  languageN.prev = function (answer) {
    return genderN;
  };
  languageN.next = function (answer) {
    return additionalScope;
  };

  additionalScope.prev = function (answer) {
    return languageN;
  };
  additionalScope.next = function (answer) {
    return ageN;
  };

  ageN.prev = function (answer) {
    return additionalScope;
  };
  ageN.next = function (answer) {
    return preferredCompanyN;
  };

  preferredCompanyN.prev = function (answer) {
    return ageN;
  };
  preferredCompanyN.next = function (answer) {
    return userNameN;
  };

  userNameN.prev = function (answer) {
    return preferredCompanyN;
  };

  return cover;
}

function getRetirementPlanningQuestions() {
  const retirementPlanningN = startRetirementNode();
  retirementPlanningN.next = function (answer) {
    if (answer[this.key] === "YES") {
      const retirementReview = reviewRetirementNode();
      retirementReview.prev = function () {
        return retirementPlanningN;
      };
      retirementReview.next = function (answer) {
        const adv = getAdvisorPreferenceQuestions();
        adv.prev = function () {
          return retirementReview;
        };
        return adv;
      };
      return retirementReview;
    }
    const n = considerRetirementNode();
    n.prev = function () {
      return retirementPlanningN;
    };
    n.next = function (answer) {
      const adv = getAdvisorPreferenceQuestions();
      adv.prev = function () {
        return n;
      };
      return adv;
    };
    return n;
  };
  return retirementPlanningN;
}

function getRetirementAndLagacyPlanningQuestions() {
  const retirementPlanningN = startRetirementNode();
  retirementPlanningN.next = function (answer) {
    if (answer[this.key] === "YES") {
      const retirementReview = reviewRetirementNode();
      retirementReview.prev = function () {
        return retirementPlanningN;
      };
      retirementReview.next = function (answer) {
        const lagacy = lagacyPlanningNode();
        lagacy.prev = function () {
          return retirementReview;
        };
        lagacy.next = function () {
          const adv = getAdvisorPreferenceQuestions();
          adv.prev = function () {
            return lagacy;
          };
          return adv;
        };
        return lagacy;
      };
      return retirementReview;
    }
    const n = considerRetirementNode();
    n.prev = function () {
      return retirementPlanningN;
    };
    n.next = function (answer) {
      const lagacy = lagacyPlanningNode();
      lagacy.prev = function () {
        return n;
      };
      lagacy.next = function () {
        const adv = getAdvisorPreferenceQuestions();
        adv.prev = function () {
          return lagacy;
        };
        return adv;
      };
      return lagacy;
    };
    return n;
  };
  return retirementPlanningN;
}

function getRetirementLagacyAndProtectionQuestions() {
  const retirementPlanningN = startRetirementNode();
  retirementPlanningN.next = function (answer) {
    if (answer[this.key] === "YES") {
      const retirementReview = reviewRetirementNode();
      retirementReview.prev = function () {
        return retirementPlanningN;
      };
      retirementReview.next = function (answer) {
        const lagacy = lagacyPlanningNode();
        lagacy.prev = function () {
          return retirementReview;
        };
        lagacy.next = function () {
          const DTPDN = DTPDProtection();
          const insuranceFamilarityN = insuranceFamilarity();
          DTPDN.prev = function () {
            return lagacy;
          };
          DTPDN.next = function () {
            return insuranceFamilarityN;
          };
          insuranceFamilarityN.prev = function () {
            return DTPDN;
          };
          insuranceFamilarityN.next = function () {
            const adv = getAdvisorPreferenceQuestions();
            adv.prev = function () {
              return insuranceFamilarityN;
            };
            return adv;
          };
          return DTPDN;
        };
        return lagacy;
      };
      return retirementReview;
    }
    const n = considerRetirementNode();
    n.prev = function () {
      return retirementPlanningN;
    };
    n.next = function (answer) {
      const lagacy = lagacyPlanningNode();
      lagacy.prev = function () {
        return n;
      };
      lagacy.next = function () {
        const DTPDN = DTPDProtection();
        const insuranceFamilarityN = insuranceFamilarity();
        DTPDN.prev = function () {
          return lagacy;
        };
        DTPDN.next = function () {
          return insuranceFamilarityN;
        };
        insuranceFamilarityN.prev = function () {
          return DTPDN;
        };
        insuranceFamilarityN.next = function () {
          const adv = getAdvisorPreferenceQuestions();
          adv.prev = function () {
            return insuranceFamilarityN;
          };
          return adv;
        };
        return DTPDN;
      };
      return lagacy;
    };
    return n;
  };
  return retirementPlanningN;
}
