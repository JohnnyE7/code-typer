package main

type Exercise struct {
	ID         string `json:"id"`
	Title      string `json:"title"`
	Language   string `json:"language"`
	Difficulty string `json:"difficulty"`
	Code       string `json:"code"`
}

var exercises = []Exercise{
	{
		ID:         "go-two-sum-map",
		Title:      "Two Sum Map",
		Language:   "Go",
		Difficulty: "Warmup",
		Code: "func twoSum(nums []int, target int) []int {\n" +
			"\tseen := make(map[int]int, len(nums))\n" +
			"\tfor i, value := range nums {\n" +
			"\t\tif j, ok := seen[target-value]; ok {\n" +
			"\t\t\treturn []int{j, i}\n" +
			"\t\t}\n" +
			"\t\tseen[value] = i\n" +
			"\t}\n" +
			"\treturn nil\n" +
			"}",
	},
	{
		ID:         "go-channel-worker",
		Title:      "Buffered Channel Worker",
		Language:   "Go",
		Difficulty: "Syntax",
		Code: "func startWorker(limit int) chan int {\n" +
			"\tjobs := make(chan int, limit)\n" +
			"\tgo func() {\n" +
			"\t\tdefer close(jobs)\n" +
			"\t\tfor i := 0; i < limit; i++ {\n" +
			"\t\t\tjobs <- i * i\n" +
			"\t\t}\n" +
			"\t}()\n" +
			"\treturn jobs\n" +
			"}",
	},
	{
		ID:         "go-binary-search",
		Title:      "Binary Search",
		Language:   "Go",
		Difficulty: "Algo",
		Code: "func search(nums []int, target int) int {\n" +
			"\tleft, right := 0, len(nums)-1\n" +
			"\tfor left <= right {\n" +
			"\t\tmid := left + (right-left)/2\n" +
			"\t\tswitch {\n" +
			"\t\tcase nums[mid] == target:\n" +
			"\t\t\treturn mid\n" +
			"\t\tcase nums[mid] < target:\n" +
			"\t\t\tleft = mid + 1\n" +
			"\t\tdefault:\n" +
			"\t\t\tright = mid - 1\n" +
			"\t\t}\n" +
			"\t}\n" +
			"\treturn -1\n" +
			"}",
	},
	{
		ID:         "js-two-sum-map",
		Title:      "Two Sum Map",
		Language:   "JavaScript",
		Difficulty: "Warmup",
		Code: "function twoSum(nums, target) {\n" +
			"    const seen = new Map();\n" +
			"    for (let i = 0; i < nums.length; i++) {\n" +
			"        const need = target - nums[i];\n" +
			"        if (seen.has(need)) {\n" +
			"            return [seen.get(need), i];\n" +
			"        }\n" +
			"        seen.set(nums[i], i);\n" +
			"    }\n" +
			"    return [];\n" +
			"}",
	},
	{
		ID:         "python-two-sum-map",
		Title:      "Two Sum Map",
		Language:   "Python",
		Difficulty: "Warmup",
		Code: "def two_sum(nums, target):\n" +
			"    seen = {}\n" +
			"    for i, value in enumerate(nums):\n" +
			"        need = target - value\n" +
			"        if need in seen:\n" +
			"            return [seen[need], i]\n" +
			"        seen[value] = i\n" +
			"    return []",
	},
}

func findExercise(id string) Exercise {
	for _, exercise := range exercises {
		if exercise.ID == id {
			return exercise
		}
	}
	return exercises[0]
}
